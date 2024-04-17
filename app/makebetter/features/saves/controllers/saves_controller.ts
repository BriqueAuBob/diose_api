import { inject } from '@adonisjs/core'
import SaveRepository from '../repositories/save_repository.js'

@inject()
export default class SavesController {
  constructor(private saveRepository: SaveRepository) {}

  async index() {
    return await this.saveRepository.getAll()
  }
}
