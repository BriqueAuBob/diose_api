import RequestStatus from '#requests/enums/status'
import vine from '@vinejs/vine'

export const createRequestValidator = vine.compile(
  vine.object({
    data: vine.object({}),
  })
)

export const updateRequestValidator = vine.compile(
  vine.object({
    data: vine.string(),
    status: vine.enum(RequestStatus),
  })
)
