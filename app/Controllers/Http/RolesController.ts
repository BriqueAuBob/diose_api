// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Role from 'App/Models/Role';

export default class RolesController {
    async index({ request }) {
        const roles = await Role.query()
            .where('display_name', 'LIKE', '%' + request.input('search') + '%')
            .orWhere('name', 'LIKE', '%' + request.input('search') + '%')
            .paginate(request.input('page'), 20);

        return {
            success: true,
            meta: roles.getMeta(),
            roles: roles.toJSON().data,
        };
    }

    async show({ request }) {
        const role = await Role.find(request.param('id'));
        await role?.load('permissions');
        return {
            success: true,
            role,
        };
    }

    async store({ request }) {
        const role = new Role();
        role.name = request.input('name');
        role.display_name = request.input('display_name');
        await role.save();

        if (request.input('permissions')) {
            await role.related('permissions').sync(request.input('permissions'));
        }

        return {
            success: true,
            role,
        };
    }

    async update({ request }) {
        const role = await Role.find(request.param('id'));
        if (role) {
            role.name = request.input('name');
            role.display_name = request.input('display_name');
            role.save();

            if (request.input('permissions')) {
                await role.related('permissions').sync(request.input('permissions'));
            }
        } else {
            return {
                success: false,
                message: 'Role introuvable...',
            };
        }
        return {
            success: true,
            role,
        };
    }

    async destroy({ request }) {
        const role = await Role.find(request.param('id'));
        if (role) {
            await role.delete();
        } else {
            return {
                success: false,
                message: 'Role introuvable...',
            };
        }
        return {
            success: true,
            message: 'Role supprimé avec succès !',
        };
    }
}
