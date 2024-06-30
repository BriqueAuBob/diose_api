import Websockets from '#services/websockets'
import env from './env.js'
import collaboration from './websockets/collaboration.js'

const instance = Websockets.getInstance()
const io = instance.getIO()

io.on('connection', (socket) => {
  console.log('new connection', socket)
  collaboration({ instance, socket })
})

instance.listen(env.get('PORT'))
