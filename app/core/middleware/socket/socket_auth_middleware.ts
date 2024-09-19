import type { Authenticators } from '@adonisjs/auth/types'
import type { SocketMiddleware } from '#services/websockets'

const SocketAuthMiddleware =
  (options: { guards?: (keyof Authenticators)[] } = {}): SocketMiddleware =>
  async (socket: any, next: any) => {
    try {
      await socket.context.auth.authenticateUsing(options.guards)
      next()
    } catch (error) {
      next(new Error(error))
    }
  }

export default SocketAuthMiddleware
