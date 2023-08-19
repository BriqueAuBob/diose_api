import mongoose from 'mongoose';
const ToolSave = mongoose.model('ToolSave');
import User from 'App/Models/User';

export default class SavesController {
    public async index({ request, auth, response }) {
        const { page = 1, per_page = 10, search = '', sort_by = '', tags = [], personal = false } = request.all();

        if (personal && !auth.user) return response.status(401).send({ error: 'Unauthorized' });

        const copy: any[] = [];
        const sortBy = sort_by ? sort_by.split(':') : '';
        const filters = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: tags } },
            ],
        };
        if (personal) {
            filters['authorId'] = auth?.user?.id;
        } else {
            filters['isPublic'] = true;
        }
        const saves = await ToolSave.find(filters, null, {
            skip: (page - 1) * per_page,
            limit: per_page,
            collation: {
                locale: 'fr',
            },
            sort: {
                [sortBy[0]]: parseInt(sortBy[1]),
            },
        });
        const count = await ToolSave.countDocuments(filters);
        for (const save of saves) {
            const saveCopy = { ...save._doc };
            if (save.verified) {
                saveCopy.author = {
                    username: 'MakeBetter',
                    avatar: 'https://cdn.discordapp.com/avatars/983094528791683182/3ca96d35287c9c560f435c143f4b3448.webp?size=128',
                };
            } else if (personal) {
                saveCopy.author = auth?.user?.$original;
            } else {
                saveCopy.author = (await User.find(save.authorId))?.$original ?? {
                    username: 'Unknown',
                    avatar: '/images/default_avatar.png',
                };
            }
            saveCopy.data = [saveCopy.data[0]];
            copy.push(saveCopy);
        }

        return {
            saves: copy,
            total: count,
            page,
        };
    }

    public async store({ auth, request, response }) {
        const { name, description, tags, data, type, isPublic } = request.all();
        const save = new ToolSave({
            authorId: auth.user.id,
            name,
            description,
            tags,
            data,
            type,
            isPublic,
        });
        await save.save();
        return response.status(201).send(save);
    }

    public async show({ auth, request }) {
        const { id } = request.params();
        const save = await ToolSave.findById(id);
        if (!save) return { error: 'Save not found' };
        if (!save.isPublic && save.authorId !== auth?.user?.id) return { error: 'Unauthorized' };
        return { save };
    }

    public async update({ auth, request }) {
        const { id } = request.params();
        const { name, description, tags, data, type, isPublic } = request.all();
        const save = await ToolSave.findById(id);
        if (!save) return { error: 'Save not found' };
        if (save.authorId !== auth?.user?.id) return { error: 'Unauthorized' };
        save.name = name;
        save.description = description;
        save.tags = tags;
        save.data = data;
        save.type = type;
        save.isPublic = isPublic;
        await save.save();
        return { save };
    }
}
