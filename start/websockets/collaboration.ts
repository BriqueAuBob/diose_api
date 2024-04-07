import WSSContext from '#contracts/ws_context'
import RealtimeCollaborationController from '#makebetter/features/collaboration/controllers/realtime_collaboration_controller'

export default ({ instance, socket }: WSSContext) => {
  instance.registerEvent(socket, 'collaboration:cursor:move', [
    RealtimeCollaborationController,
    'cursorMoved',
  ])
}
