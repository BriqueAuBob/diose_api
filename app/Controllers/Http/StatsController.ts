// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User';
import Usage from 'App/Models/Usage';
import Database from '@ioc:Adonis/Lucid/Database';

export default class StatsController {
    public async get() {
        const testimonialsAvg = await Database.query().from('testimonials').avg('star', 'avg').count('id', 'count');

        // this week stats (last 7 days)
        const weekStats = await Database.query()
            .from('usages')
            .count('id', 'count')
            .where('created_at', '>=', Database.raw('NOW() - INTERVAL 7 DAY'));

        const weekStatsUsers = await Database.query()
            .from('users')
            .count('id', 'count')
            .where('created_at', '>=', Database.raw('NOW() - INTERVAL 7 DAY'));

        const lastWeekStats = await Database.query()
            .from('usages')
            .count('id', 'count')
            .where('created_at', '>=', Database.raw('NOW() - INTERVAL 14 DAY'))
            .where('created_at', '<=', Database.raw('NOW() - INTERVAL 7 DAY'));

        const lastWeekStatsUsers = await Database.query()
            .from('users')
            .count('id', 'count')
            .where('created_at', '>=', Database.raw('NOW() - INTERVAL 14 DAY'))
            .where('created_at', '<=', Database.raw('NOW() - INTERVAL 7 DAY'));

        const weekLoginStat = await Database.query()
            .from('api_tokens')
            .count('id', 'count')
            .where('created_at', '>=', Database.raw('NOW() - INTERVAL 7 DAY'));

        const lastWeekLoginStat = await Database.query()
            .from('api_tokens')
            .count('id', 'count')
            .where('created_at', '>=', Database.raw('NOW() - INTERVAL 14 DAY'))
            .where('created_at', '<=', Database.raw('NOW() - INTERVAL 7 DAY'));

        const membersCount = await User.query().getCount();
        const toolsUsageCount = await Usage.query().getCount();

        return {
            success: true,
            members: membersCount,
            tools: toolsUsageCount,
            testimonials: testimonialsAvg[0].count,
            testimonialsAvg: testimonialsAvg[0].avg,
            weekStats: weekStats[0].count,
            weekStatsUsers: weekStatsUsers[0].count,
            lastWeekStats: lastWeekStats[0].count,
            lastWeekStatsUsers: lastWeekStatsUsers[0].count,
            weekLoginStat: weekLoginStat[0].count,
            lastWeekLoginStat: lastWeekLoginStat[0].count,
        };
    }

    public async store({ auth, request }) {
        const authenticated = await auth.use('api').check();
        const user = authenticated ? auth.user : null;
        const { tool } = request.all();

        await Usage.create({
            // @ts-ignore
            user_id: user?.id,
            tool,
            ip: request.ip(),
        });

        return {
            success: true,
        };
    }

    public async getUsages({ auth }) {
        const usages = await Usage.query().where('user_id', auth.user.id).select('*');
        return {
            success: true,
            usages,
        };
    }

    public async getAdminUsages({ request }) {
        const usages = await Usage.query()
            .orderBy('id', 'desc')
            .preload('author')
            .where('tool', 'LIKE', '%' + request.input('search') + '%')
            .orWhereHas('author', (query) => {
                query.where('username', 'LIKE', '%' + request.input('search') + '%');
            })
            .select('*')
            .paginate(request.input('page'), 20);
        return {
            success: true,
            meta: usages.getMeta(),
            usages: usages.toJSON().data,
        };
    }
}
