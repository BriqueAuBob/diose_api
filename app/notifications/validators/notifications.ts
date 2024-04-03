import vine from '@vinejs/vine'

export const notificationValidator = vine.object({
  title: vine.string(),
  message: vine.string(),
})

export const createNotificationValidator = vine.compile(notificationValidator)

export const updateNotificationValidator = vine.compile(notificationValidator)

export const massCreateNotificationValidator = vine.compile(
  vine.object({
    targets: vine.array(vine.number()),
    data: notificationValidator,
  })
)

export const massUpdateNotificationValidator = vine.compile(
  vine.object({
    targets: vine.array(vine.number()),
    data: notificationValidator,
  })
)

export const markNotificationAsReadValidator = vine.compile(
  vine.object({
    isRead: vine.boolean(),
  })
)
