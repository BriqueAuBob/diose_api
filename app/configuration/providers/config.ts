import Configuration from '../models/configuration.js'
import config from '@adonisjs/core/services/config'
// @ts-ignore
import merge from 'lodash.merge'

const castValue = (value: string, type: string) => {
  switch (type) {
    case 'boolean':
      return value === 'true'
    case 'number':
      return parseFloat(value)
    case 'json':
      return JSON.parse(value)
    default:
      return value
  }
}

export default class ConfigProvider {
  async ready() {
    try {
      const defaultConfig = (config.get('dynamic') as any)?.DynamicConfiguration
      const conf = (await Configuration.all()).reduce(
        (acc, { name, value, type: typeValue }) => {
          acc[name] = castValue(value, typeValue)
          if (typeValue === 'json') {
            acc[name] = merge(defaultConfig[name], acc[name])
          }
          return acc
        },
        <{ [key: string]: any }>{}
      )

      const mergedConf = { ...defaultConfig, ...conf }
      config.set('dynamic', mergedConf)
    } catch (err) {
      console.error('Impossible to load dynamic configuration from database')
      process.exit(1)
    }
  }
}
