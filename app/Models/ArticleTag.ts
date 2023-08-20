import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

export default class ArticleTag extends BaseModel {
    @column({ isPrimary: true })
    public article_id: number;

    @column({ isPrimary: true })
    public tag_id: number;
}
