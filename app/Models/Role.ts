import { DateTime } from 'luxon';
import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm';
import Permission from './Permission';

export default class Role extends BaseModel {
    @column({ isPrimary: true })
    public id: number;

    @column()
    public name: string;

    @column()
    public display_name: string;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;

    @manyToMany(() => Permission, {
        pivotTable: 'roles_permissions',
    })
    public permissions: ManyToMany<typeof Permission>;
}
