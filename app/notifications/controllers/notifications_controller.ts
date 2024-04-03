import NotificationRepository from '#notifications/repositories/notification_repository'
import { markNotificationAsReadValidator } from '#notifications/validators/notifications'
import User from '#users/models/user'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class NotificationsController {
  constructor(private notificationRepository: NotificationRepository) {}

  public async index({ auth }: HttpContext) {
    return await this.notificationRepository.getUserNotifications(auth?.user as User)
  }

  public async show({ params, auth }: HttpContext) {
    const notification = await this.notificationRepository.find(params.id)
    if (notification.userId !== auth?.user?.id) {
      throw new Error('Unauthorized')
    }
    return notification
  }

  public async update({ params, request }: HttpContext) {
    const notification = await this.notificationRepository.find(params.id)
    const data = await request.validateUsing(markNotificationAsReadValidator)
    return await this.notificationRepository.update(notification, data)
  }

  public async destroy({ params }: HttpContext) {
    return await this.notificationRepository.delete(params.id)
  }
}
