import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DynamicConfiguration } from '#config/dynamic'
import Configuration from '#models/configuration'

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
  }
}
