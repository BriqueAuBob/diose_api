import Tag from 'App/Models/Tag';
import { schema } from '@ioc:Adonis/Core/Validator';

// create index, show, store, update, destroy methods
export default class TagsController {
    public async index() {
        const tags = await Tag.all();
        return { tags };
    }

    public async show({ params }) {
        const { id } = params;
        const tag = await Tag.findOrFail(id);
        return { tag };
    }

    public async store({ request }) {
        const data = await request.validate({
            schema: schema.create({
                name: schema.string(),
                bg_color: schema.string(),
                text_color: schema.string(),
            }),
        });
        const tag = await Tag.create(data);
        return { tag };
    }

    public async update({ params, request }) {
        const { id } = params;
        const data = await request.validate({
            schema: schema.create({
                name: schema.string(),
                bg_color: schema.string(),
                text_color: schema.string(),
            }),
        });
        const tag = await Tag.findOrFail(id);
        tag.merge(data);
        await tag.save();
        return { tag };
    }

    public async destroy({ params }) {
        const { id } = params;
        const tag = await Tag.findOrFail(id);
        await tag.delete();
        return { tag };
    }
}
