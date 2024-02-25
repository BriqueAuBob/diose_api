import Configuration from '#models/configuration'
import config from '@adonisjs/core/services/config'

interface ConfigData {
  name: string
  description?: string
  value: string
  expose?: boolean
  type?: 'json' | 'string' | 'number' | 'boolean'
}

export default class ConfigurationRepository {
  async all(): Promise<Configuration[]> {
    return Configuration.all()
  }

  async find(id: number): Promise<Configuration | null> {
    return Configuration.find(id)
  }

  async create(data: ConfigData): Promise<void> {
    const conf = await Configuration.create(data)
    if (conf) {
      config.set('dynamic.' + conf.name, conf.value)
    }
  }

  async update(id: number, data: ConfigData): Promise<Configuration | null> {
    const confDb = await Configuration.find(id)
    if (confDb) {
      confDb.merge(data)
      await confDb.save()
      config.set('dynamic.' + confDb.name, confDb.value)
    }
    return confDb
  }

  async delete(id: number): Promise<void> {
    const conf = await Configuration.find(id)
    if (conf) {
      await conf.delete()
      config.set('dynamic.' + conf.name, null)
    }
  }
}
