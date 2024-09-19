import { ServerResponse } from 'node:http'
import app from '@adonisjs/core/services/app'
import type { SocketMiddleware } from '#services/websockets'

const SocketHttpContextMiddleware: SocketMiddleware = async (socket: any, next: any) => {
  const adonisServer = await app.container.make('server')

  // Create a http context for the socket
  const response = new ServerResponse(socket.request)
  const context = adonisServer.createHttpContext(
    adonisServer.createRequest(socket.request, response),
    adonisServer.createResponse(socket.request, response),
    app.container.createResolver()
  )

  // Initialize auth
  const auth = await app.container.make('auth.manager')
  context.auth = auth.createAuthenticator(context)

  console.log(context.auth.authenticate())

  socket.context = context

  next()
}

export default SocketHttpContextMiddleware
