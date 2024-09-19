import server from '@adonisjs/core/services/server'
import { Server, Socket } from 'socket.io'

type ControllerMethod = [any, string]

export default class Websockets {
  private static instance: Websockets
  private io: Server

  private constructor() {
    this.io = new Server(server.getNodeServer(), {
      cors: {
        origin: '*',
      },
    })
  }

  public static getInstance(): Websockets {
    if (!Websockets.instance) {
      Websockets.instance = new Websockets()
    }

    return Websockets.instance
  }

  public getIO(): Server {
    return this.io
  }

  public listen(port: number): void {
    this.io.listen(port)
  }

  public registerEvent(socket: Socket, event: string, controllerMethod: ControllerMethod): void {
    const controller = new controllerMethod[0]()
    socket.on(event, (data) => {
      controller[controllerMethod[1]]({
        instance: Websockets.getInstance(),
        socket,
        data,
      })
    })
  }

  public addEventListener(event: string, controllerMethod: ControllerMethod): void {
    this.io.on(event, (socket) => {
      const controller = new controllerMethod[0]()
      controller[controllerMethod[1]]({
        instance: Websockets.getInstance(),
        socket,
      })
    })
  }
}
export type SocketMiddleware = Parameters<Websockets['io']['use']>[0]
