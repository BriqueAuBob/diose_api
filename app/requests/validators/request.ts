import { notificationValidator } from '#notifications/validators/notifications'
import RequestStatus from '#requests/enums/status'
import vine from '@vinejs/vine'

const dataValidators = {
  notifications: notificationValidator,
}

export const createRequestValidator = (type: string) => {
  const dataValidator = dataValidators[type as keyof typeof dataValidators]
  if (!dataValidator) {
    throw new Error(`Invalid request type: ${type}`)
  }
  return vine.compile(
    vine.object({
      data: dataValidator,
    })
  )
}

export const updateRequestValidator = vine.compile(
  vine.object({
    data: vine.object({}),
    status: vine.enum(RequestStatus),
  })
)
