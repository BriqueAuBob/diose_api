import mongoose from 'mongoose';
const ToolSave = mongoose.model('ToolSave');
import User from 'App/Models/User';
import Ws from 'App/Services/Ws';

type Permission = {
    userId: number;
    permission: string;
};

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
            $and: [
                { type: 'discord_embed' },
                personal
                    ? {
                          $or: [
                              { authorId: auth?.user?.id },
                              { permissions: { $elemMatch: { userId: auth?.user?.id } } },
                          ],
                      }
                    : {
                          isPublic: true,
                      },
            ],
        };
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
                saveCopy.author = auth?.user;
            } else {
                saveCopy.author = (await User.find(save.authorId)) ?? {
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

    public async show({ auth, request, response }) {
        const { id } = request.params();
        const save = await ToolSave.findById(id);
        if (!save) return response.status(404).send('Save not found');
        if (
            !save.isPublic &&
            save.authorId !== auth?.user?.id &&
            !save.permissions?.find((permission: Permission) => permission.userId === auth?.user?.id)
        )
            return response.status(403).send('Unauthorized');
        return { save };
    }

    public async update({ auth, request, response }) {
        const { id } = request.params();
        const { name, description, tags, data, type, isPublic } = request.all();
        const save = await ToolSave.findById(id);
        if (!save) return response.status(404).send('Save not found');
        if (
            save.authorId !== auth?.user?.id &&
            !save.permissions.find(
                (permission: Permission) => permission.userId === auth?.user?.id && permission.permission === 'edit'
            )
        )
            return response.status(403).send('Unauthorized');
        save.name = name;
        save.description = description;
        save.tags = tags;
        save.data = data;
        save.type = type;
        save.isPublic = isPublic;
        await save.save();
        return { save };
    }

    public async permissions({ auth, request, response }) {
        const { id } = request.params();
        const save = await ToolSave.findById(id);
        if (!save) return response.status(404).send('Save not found');
        if (
            save.authorId !== auth?.user?.id &&
            !save.permissions.find((permission: Permission) => auth.user?.id === permission.userId)
        )
            return response.status(403).send('Unauthorized');
        const permissions: any[] = [];
        permissions.push({
            user: auth?.user?.id === save?.authorId ? auth?.user : await User.find(save?.authorId),
            permission: 'admin',
        });
        for (const permission of save?.permissions || []) {
            permissions.push({
                user: await User.find(permission?.user?.id ?? permission.userId),
                permission: permission.permission,
            });
        }
        return { permissions };
    }

    public async permissionsSet({ auth, request, response }) {
        const { id } = request.params();
        const { permissions } = request.all();
        const save = await ToolSave.findById(id);
        if (!save) return response.status(404).send('Save not found');
        if (save.authorId !== auth?.user?.id) return response.status(403).send('Unauthorized');
        save.permissions = permissions.filter(
            (permission: { permission: string }) =>
                permission.permission !== 'admin' && permission.permission !== 'none'
        );
        await save.save();
        Ws.io.to(save._id.toString()).emit('change_permissions', permissions);
        return { save };
    }
}
