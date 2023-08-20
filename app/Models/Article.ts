import { DateTime } from 'luxon';
import { BaseModel, HasMany, HasOne, ManyToMany, column, hasMany, hasOne, manyToMany } from '@ioc:Adonis/Lucid/Orm';
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify';
import User from './User';
import ArticleView from './ArticleView';
import Tag from './Tag';
import Env from '@ioc:Adonis/Core/Env';

export default class Article extends BaseModel {
    @column({ isPrimary: true })
    public id: number;

    @column()
    public title_fr: string;

    @column()
    public title_en: string;

    @column()
    public description_fr: string;

    @column()
    public description_en: string;

    @column()
    @slugify({
        strategy: 'dbIncrement',
        fields: ['title_fr'],
        allowUpdates: true,
    })
    public slug_fr: string;

    @column()
    @slugify({
        strategy: 'dbIncrement',
        fields: ['title_en'],
        allowUpdates: true,
    })
    public slug_en: string;

    @column()
    public content_fr: string;

    @column()
    public content_en: string;

    @column({
        serialize: (value: string) => {
            return Env.get('APP_URL') + value;
        },
        prepare: (value: string) => {
            return value.replace(Env.get('APP_URL'), '');
        },
    })
    public image_fr: string;

    @column({
        serialize: (value: string) => {
            return Env.get('APP_URL') + value;
        },
        prepare: (value: string) => {
            return value.replace(Env.get('APP_URL'), '');
        },
    })
    public image_en: string;

    @column({
        consume(value) {
            return value == 1;
        },
    })
    public isPublished: boolean;

    @column()
    public type: string;

    @column()
    public authorId: number;

    @hasOne(() => User, {
        localKey: 'authorId',
        foreignKey: 'id',
    })
    public author: HasOne<typeof User>;

    @manyToMany(() => Tag, {
        pivotTable: 'articles_tags',
    })
    public tags: ManyToMany<typeof Tag>;

    @hasMany(() => ArticleView, {
        localKey: 'id',
        foreignKey: 'article_id',
    })
    public views: HasMany<typeof ArticleView>;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;
}
