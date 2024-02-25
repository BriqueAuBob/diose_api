import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import LogRepository from '#repositories/log'

@inject()
export default class LogsController {
  constructor(private logRepository: LogRepository) {}

  public async index({ response }: HttpContext) {
    return response.send(await this.logRepository.getAll())
  }
}
