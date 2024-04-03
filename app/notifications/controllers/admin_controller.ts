import NotificationRepository from '#notifications/repositories/notification_repository'
import {
  createNotificationValidator,
  massCreateNotificationValidator,
  massUpdateNotificationValidator,
  updateNotificationValidator,
} from '#notifications/validators/notifications'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AdminNotificationsController {
  constructor(private notificationRepository: NotificationRepository) {}

  public async index({}: HttpContext) {
    return await this.notificationRepository.getAll()
  }

  public async show({ params }: HttpContext) {
    const notification = await this.notificationRepository.find(params.id)
    return notification
  }

  public async store({ request }: HttpContext) {
    const data = await request.validateUsing(createNotificationValidator)
    return await this.notificationRepository.create(data)
  }

  public async massStore({ request }: HttpContext) {
    const data = await request.validateUsing(massCreateNotificationValidator)
    return await this.notificationRepository.massCreate(data.targets, data.data)
  }

  public async update({ params, request }: HttpContext) {
    const notification = await this.notificationRepository.find(params.id)
    const data = await request.validateUsing(updateNotificationValidator)
    return await this.notificationRepository.update(notification, data)
  }

  public async massUpdate({ request }: HttpContext) {
    const data = await request.validateUsing(massUpdateNotificationValidator)
    return await this.notificationRepository.massUpdate(data.targets, data.data)
  }

  public async destroy({ params }: HttpContext) {
    return await this.notificationRepository.delete(params.id)
  }
}
