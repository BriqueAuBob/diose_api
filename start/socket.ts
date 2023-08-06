import Database from '@ioc:Adonis/Lucid/Database';
import User from 'App/Models/User';
import Ws from 'App/Services/Ws';
import { Socket } from 'socket.io';
import crypto from 'crypto';
Ws.boot();

function urlDecode(encoded) {
    return Buffer.from(encoded, 'base64').toString('utf-8');
}

function generateHash(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

function parseToken(token) {
    const parts = token.split('.');
    /**
     * Ensure the token has two parts
     */
    if (parts.length !== 2) {
        throw new Error('E_INVALID_API_TOKEN');
    }

    /**
     * Ensure the first part is a base64 encode id
     */
    const tokenId = urlDecode(parts[0]);

    if (!tokenId) {
        throw new Error('E_INVALID_API_TOKEN');
    }

    const parsedToken = generateHash(parts[1]);
    return {
        token: parsedToken,
        tokenId,
    };
}

async function checkToken(token: string): Promise<User> {
    const parsedToken = parseToken(token);
    const user = await Database.query()
        .from('api_tokens')
        .select('user_id', 'users.username', 'users.avatar')
        .where('token', parsedToken.token)
        .join('users', 'users.id', 'api_tokens.user_id')
        .first();
    if (!user) {
        throw new Error('E_INVALID_API_TOKEN');
    }
    return user as User;
}

async function authenticate(socket: Socket): Promise<User | string> {
    const token = socket.handshake?.query?.token;

    if (!token || typeof token !== 'string') {
        return 'Missing parameter';
    }

    try {
        const user = await checkToken(token);
        return user;
    } catch (error) {
        return 'Invalid token';
    }
}

function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        hex = 'ffffff';
    }
    let r: string | number = parseInt(hex.slice(0, 2), 16),
        g: string | number = parseInt(hex.slice(2, 4), 16),
        b: string | number = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // http://stackoverflow.com/a/3943023/112731
        return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len = 2) {
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

/**
 * Listen for incoming socket connections
 */
let onlineUsers: any[] = [];
Ws.io.on('connection', async (socket) => {
    const user = await authenticate(socket);
    if (!user || typeof user === 'string') return;

    // handle users logged
    const color = Math.floor(Math.random() * 16777215).toString(16);
    onlineUsers.push({
        ...user,
        socketId: socket.id,
        position: {
            x: 0,
            y: 0,
        },
        color: '#' + color,
        textColor: invertColor('#' + color, true),
    });
    Ws.io.emit('onlineUsers', onlineUsers);

    socket.on('mousemove', (data) => {
        const userIndex = onlineUsers.findIndex((user) => user.socketId === socket.id);
        if (userIndex === -1) return;
        onlineUsers[userIndex].position = data;
        Ws.io.emit('onlineUsers', onlineUsers);
    });

    socket.on('valueChange', (data) => {
        console.log(data);
        Ws.io.emit('valueChange', data);
    });

    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        Ws.io.emit('onlineUsers', onlineUsers);
    });
});
