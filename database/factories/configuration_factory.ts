import factory from '@adonisjs/lucid/factories'
import Configuration from '../../app/configuration/models/configuration.js'

export const ConfigurationFactory = factory
  .define(Configuration, async () => {
    return {}
  })
  .build()
