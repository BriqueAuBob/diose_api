import { Server, Socket } from 'socket.io'

type ControllerMethod = [any, string]

export default class Websockets {
  private static instance: Websockets
  private io: Server

  private constructor() {
    this.io = new Server({
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
    socket.on(event, (data) => {
      controllerMethod[0][controllerMethod[1]]({
        instance: Websockets.getInstance(),
        socket,
        data,
      })
    })
  }
}
