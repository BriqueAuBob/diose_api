import app from '@adonisjs/core/services/app'
import collaboration from './websockets/collaboration.js'
import Websockets from '#services/websockets'
import SocketHttpContextMiddleware from '#middleware/socket/socket_http_context_middleware'
import SocketAuthMiddleware from '#middleware/socket/socket_auth_middleware'

app.ready(() => {
  const instance = Websockets.getInstance()
  const io = instance.getIO()

  io.use(SocketHttpContextMiddleware).use(SocketAuthMiddleware({ guards: ['api'] }))

  io?.on('connection', (socket) => {
    collaboration({ instance, socket })
  })
})
