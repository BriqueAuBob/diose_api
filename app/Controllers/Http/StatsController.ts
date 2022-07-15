// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from "App/Models/User"

export default class StatsController {
    public async get() {
        return {
            members: await User.query().getCount()
        }
    }
}
