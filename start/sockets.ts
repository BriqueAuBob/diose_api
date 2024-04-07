import Websockets from '#services/websockets'
import collaboration from './websockets/collaboration.js'

const instance = Websockets.getInstance()
const io = instance.getIO()

io.on('connection', (socket) => {
  collaboration({ instance, socket })
})
