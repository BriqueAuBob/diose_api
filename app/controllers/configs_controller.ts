import ConfigurationRepository from '#repositories/configuration'
import { configurationValidator } from '#validators/configuration'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ConfigsController {
  constructor(private configurationRepository: ConfigurationRepository) {}

  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    return response.send(await this.configurationRepository.all())
  }

  /**
   * Handle form submission for the create action
   */
  async store({ response, request }: HttpContext) {
    const payload = await request.validateUsing(configurationValidator)
    const configuration = await this.configurationRepository.create(payload)
    return response.send(configuration)
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    return response.send(await this.configurationRepository.find(params.id))
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(configurationValidator)
    const configuration = await this.configurationRepository.update(params.id, payload)
    return response.send(configuration)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    await this.configurationRepository.delete(params.id)
    return response.send({ message: 'Record deleted' })
  }
}
