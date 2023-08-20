import { DateTime } from 'luxon';
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

export default class ArticleView extends BaseModel {
    public static table = 'articles_views';

    @column({ isPrimary: true })
    public id: number;

    @column()
    public article_id: number;

    @column()
    public user_id: number;

    @column()
    public ip_address: string;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;
}
