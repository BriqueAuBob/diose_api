import Configuration from '#models/configuration'
import config from '@adonisjs/core/services/config'

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
      const conf = (await Configuration.all()).reduce(
        (acc, { name, value, type: typeValue }) => {
          acc[name] = castValue(value, typeValue)
          return acc
        },
        <{ [key: string]: any }>{}
      )

      const mergedConf = { ...(config.get('dynamic') as any)?.DynamicConfiguration, ...conf }
      config.set('dynamic', mergedConf)
    } catch (err) {
      console.error('Impossible to load dynamic configuration from database')
      process.exit(1)
    }
  }
}
