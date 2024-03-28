import RequestStatus from '#requests/enums/status'
import RequestRepository from '#requests/repositories/request_repository'
import { inject } from '@adonisjs/core'

@inject()
export default class RequestController {
  constructor(private requestRepository: RequestRepository) {}

  public async index() {
    return this.requestRepository.getAll()
  }

  public async show(id: number) {
    return this.requestRepository.find(id)
  }

  public async store(data: any) {
    return this.requestRepository.create(data)
  }

  public async update(id: number, data: any) {
    const request = await this.requestRepository.find(id)
    if (request.status !== RequestStatus.Pending) {
      throw new Error('Only pending requests can be updated')
    }
    return this.requestRepository.update(id, data)
  }

  public async destroy(id: number) {
    return this.requestRepository.delete(id)
  }
}
