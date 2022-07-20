// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from "App/Models/User"
import Usage from "App/Models/Usage"

export default class StatsController {
    public async get() {
        return {
            members: await User.query().getCount(),
            tools: await Usage.query().getCount()
        }
    }

    public async store({ auth, request }) {
        const authenticated = await auth.use('api').check()
        const user = authenticated ? auth.user : null
        const { tool } = request.all()

        await Usage.create({
            user_id: user?.id,
            tool
        })

        return {
            message: "Usage recorded"
        }
    }
}
