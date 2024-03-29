import RequestStatus from '#requests/enums/status'
import RequestRepository from '#requests/repositories/request_repository'
import { createRequestValidator, updateRequestValidator } from '#requests/validators/request'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class RequestController {
  constructor(private requestRepository: RequestRepository) {}

  public async index() {
    return this.requestRepository.getAll()
  }

  public async show({ params }: HttpContext) {
    return this.requestRepository.find(params.id)
  }

  public async store({ request }: HttpContext) {
    return this.requestRepository.create({
      ...(await request.validateUsing(createRequestValidator)),
      type: request.param('type'),
    })
  }

  public async update({ params, request }: HttpContext) {
    const userRequest = await this.requestRepository.find(params.id)
    if (userRequest.status !== RequestStatus.Pending) {
      throw new Error('Only pending requests can be updated')
    }
    return this.requestRepository.update(
      userRequest,
      await request.validateUsing(updateRequestValidator)
    )
  }

  public async destroy({ params }: HttpContext) {
    return this.requestRepository.delete(params.id)
  }
}
