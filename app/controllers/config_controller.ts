import { HttpContext } from '@adonisjs/core/http'

export default class ConfigController {
  public async index({ response }: HttpContext) {
    return response.send('Hello world')
  }
}
