import { ModelId } from '#contracts/model_id'
import BaseRepository from '#repositories/base'
import Configuration from '../models/configuration.js'
import config from '@adonisjs/core/services/config'

interface ConfigData {
  name: string
  description?: string
  value: string
  expose?: boolean
  type?: 'json' | 'string' | 'number' | 'boolean'
}

export default class ConfigurationRepository extends BaseRepository<typeof Configuration> {
  protected model = Configuration

  override async create(data: ConfigData) {
    const conf = await super.create(data)
    if (conf) {
      config.set('dynamic.' + conf.name, conf.value)
    }
    return conf
  }

  override async update(model: Configuration | ModelId, data: ConfigData) {
    const conf = await super.update(model, data)
    config.set('dynamic.' + conf.name, conf.value)
    return conf
  }

  override async delete(id: ModelId) {
    const conf = await super.delete(id)
    config.set('dynamic.' + conf.name, null)
    return conf
  }
}
