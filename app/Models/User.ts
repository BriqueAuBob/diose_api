import { DateTime } from 'luxon';
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm';
import mongoose from 'mongoose';
import Role from 'App/Models/Role';

export default class User extends BaseModel {
    @column({ isPrimary: true })
    public id: number;

    @column()
    public discord_id: string;

    @column({ serializeAs: null })
    public email: string;

    @column()
    public username: string;

    @column()
    public discriminator: number;

    @column()
    public avatar: string;

    @column({ serializeAs: null })
    public code: string | null;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;

    @manyToMany(() => Role, {
        pivotTable: 'users_roles',
        onQuery(query) {
            query.preload('permissions');
        },
    })
    public roles: ManyToMany<typeof Role>;

    hasPermission(permission: string) {
        return this.roles.some((role) => role.permissions.some((perm) => perm.name === permission));
    }

    getPermissions() {
        return this.roles.reduce((acc, role) => {
            return [...acc, ...role.permissions];
        }, []);
    }
}

export interface UserDocument extends mongoose.Document {
    userId: number;
    guilds: any[];
}

const UserSchema = new mongoose.Schema({
    userId: { type: Number },
    guilds: { type: Array },
});

export const UserMongo = mongoose.model<UserDocument>('User', UserSchema);
