import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class BanMiddleware {
  private ignoreRoutes = ['/users/@me', '/admin/users/:user/unban']

  async handle(ctx: HttpContext, next: NextFn) {
    if (this.ignoreRoutes.includes(ctx.route!.pattern)) {
      await next()
      return
    }

    try {
      const user = await ctx?.auth?.use('api').authenticate()
      if (user?.bannedAt) {
        throw new Error('E_USER_BANNED')
      }
    } catch (error) {
      if (error.message === 'E_USER_BANNED') {
        return ctx.response.forbidden({ message: 'Your account has been banned' })
      }
    }
    await next()
  }
}
