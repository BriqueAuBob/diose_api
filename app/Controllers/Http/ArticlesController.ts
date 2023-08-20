import Article from 'App/Models/Article';
import { schema } from '@ioc:Adonis/Core/Validator';

enum ArticleType {
    'diose' = 0,
    'makebetter' = 1,
}

const articleValidationSchema = schema.create({
    title_fr: schema.string.optional(),
    title_en: schema.string.optional(),
    description_fr: schema.string.optional(),
    description_en: schema.string.optional(),
    content_fr: schema.string.optional(),
    content_en: schema.string.optional(),
    image_fr: schema.string.optional(),
    image_en: schema.string.optional(),
    is_published: schema.boolean.optional(),
    tags: schema.array.optional().members(schema.string()),
    type: schema.enum(Object.values(ArticleType)),
});

export default class ArticlesController {
    public async indexAdmin({ request }) {
        const { page = 1 } = request.all();
        const articles = await Article.query()
            .preload('author')
            .preload('tags')
            .preload('views', (query) => {
                query.select('article_id').count('* as total_views').groupBy('article_id');
            })
            .orderBy('created_at', 'desc')
            .paginate(page, 10);
        return {
            meta: articles.getMeta(),
            articles: articles.toJSON().data,
        };
    }

    public async index({ request }) {
        const { page = 1, type = 1 } = request.all();
        const articleType = typeof type === 'string' ? ArticleType[type] : type;
        const articles = await Article.query()
            .select(
                'id',
                'author_id',
                'title_fr',
                'title_en',
                'description_fr',
                'description_en',
                'slug_fr',
                'slug_en',
                'image_fr',
                'image_en',
                'created_at',
                'type'
            )
            .where('is_published', 1)
            .where('type', articleType)
            .preload('author')
            .preload('tags')
            .withCount('views')
            .orderBy('created_at', 'desc')
            .paginate(page, 6);

        return {
            meta: articles.getMeta(),
            articles: articles.toJSON().data.map((article) => {
                return {
                    ...article.$original,
                    views_count: article.$extras.views_count,
                };
            }),
        };
    }

    public async show({ request, params, auth }) {
        const { slug } = params;
        const user = auth.user;
        if (user) {
            await user?.load('roles');
        }
        const article = await Article.query()
            .where('slug_fr', slug)
            .orWhere('slug_en', slug)
            .orWhere('id', slug)
            .if(!user.hasPermission('view_articles'), (query) => query.where('is_published', true))
            .preload('author')
            .preload('tags')
            .preload('views', (query) => {
                query.select('article_id').count('* as total_views').groupBy('article_id');
            })
            .firstOrFail();

        await article.load('views', (query) => {
            query.if(user, (query) => query.where('user_id', user.id)).orWhere('ip_address', request.ip());
        });
        if (article.views.length === 0) {
            await article.related('views').create({
                user_id: user.id,
                ip_address: request.ip(),
            });
        }

        return { article };
    }

    public async store({ request, auth }) {
        // validator
        const data = await request.validate({
            schema: articleValidationSchema,
        });

        data.type = typeof data.type === 'string' ? ArticleType[data.type] : data.type;

        const article = await Article.create({
            ...data,
            authorId: auth.user.id,
        });

        await article.related('tags').sync(data.tags);

        return { article };
    }

    public async update({ request, params }) {
        const { slug } = params;
        const data = await request.validate({
            schema: articleValidationSchema,
        });

        const article = await Article.query()
            .where('slug_fr', slug)
            .orWhere('slug_en', slug)
            .orWhere('id', slug)
            .firstOrFail();

        await article.related('tags').sync(data.tags);

        data.type = typeof data.type === 'string' ? ArticleType[data.type] : data.type;
        await article.merge(data).save();

        return { article };
    }
}
