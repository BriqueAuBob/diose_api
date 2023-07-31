import { DateTime } from 'luxon';
import { belongsTo, BelongsTo, BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

import User from 'App/Models/User';

export default class Usage extends BaseModel {
    @column({ isPrimary: true })
    public id: number;

    @column()
    public userId: number;

    @belongsTo(() => User)
    public author: BelongsTo<typeof User>;

    @column()
    public tool: string;

    @column()
    public ip: string;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;
}
