import type Websockets from '#services/websockets'
import type { Socket } from 'socket.io'

type WSSContext = {
  instance: Websockets
  socket: Socket
  data?: any
}

export default WSSContext
