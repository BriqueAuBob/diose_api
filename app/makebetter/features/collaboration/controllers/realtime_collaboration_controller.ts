import WSSContext from '#contracts/ws_context'

export default class RealtimeCollaborationController {
  public cursorMoved(ctx: WSSContext) {
    console.log('cursor move', ctx)
  }

  public memberJoined(ctx: WSSContext) {
    console.log('member joined', ctx)
  }
}
