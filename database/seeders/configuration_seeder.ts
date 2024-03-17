import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DynamicConfiguration } from '#config/dynamic'
import Configuration from '../../app/configuration/models/configuration.js'
import config from '@adonisjs/core/services/config'
// @ts-ignore
import merge from 'lodash.merge'

export default class extends BaseSeeder {
  async run() {
    const mapConfiguration: Partial<Configuration>[] = Object.entries(DynamicConfiguration).map(
      ([name, value]) => {
        const data = {
          name,
          expose: false,
        }
        switch (typeof value) {
          case 'object':
            return {
              ...data,
              value: JSON.stringify(value),
              type: 'json',
            }
          case 'number':
            return {
              ...data,
              value,
              type: 'number',
            }
          case 'boolean':
            return {
              ...data,
              value,
              type: 'boolean',
            }
          default:
            return {
              ...data,
              value,
              type: 'string',
            }
        }
      }
    )
    await Configuration.fetchOrCreateMany('name', mapConfiguration)
    console.log('Configuration seeded')

    const defaultConfig = config.get('dynamic') as any
    const confJson = await Configuration.query().where('type', 'json').exec()
    for (const config of confJson) {
      config.value = JSON.stringify(merge(defaultConfig?.[config.name], JSON.parse(config.value)))
      await config.save()
    }
    console.log('Configuration updated with default values')
  }
}
