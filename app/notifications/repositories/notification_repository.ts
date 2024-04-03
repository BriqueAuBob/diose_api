import Notification from '#notifications/models/notification'
import BaseRepository from '#repositories/base'
import User from '#users/models/user'

export default class NotificationRepository extends BaseRepository<typeof Notification> {
  protected model = Notification

  public async getUserNotifications(user: User) {
    return this.model.query().where('userId', user.id).exec()
  }

  public async massUpdate(targets: number[], data: Partial<Notification>) {
    return this.model.query().whereIn('id', targets).update(data)
  }

  public async massCreate(targets: number[], data: Partial<Notification>) {
    return this.model.createMany(targets.map((target) => ({ ...data, userId: target })))
  }
}
