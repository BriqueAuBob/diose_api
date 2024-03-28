import RequestStatus from '#requests/enums/status'
import vine from '@vinejs/vine'

export const createRequestValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    type: vine.string(),
  })
)

export const updateRequestValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    type: vine.string(),
    status: vine.enum(RequestStatus),
  })
)
