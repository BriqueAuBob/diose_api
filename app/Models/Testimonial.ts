import { DateTime } from 'luxon';
import { belongsTo, BelongsTo, BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

import User from 'App/Models/User';

export default class Testimonial extends BaseModel {
    @column({ isPrimary: true })
    public id: number;

    @column()
    public userId: number;

    @belongsTo(() => User)
    public author: BelongsTo<typeof User>;

    @column()
    public message: string;

    @column()
    public star: number;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;
}
