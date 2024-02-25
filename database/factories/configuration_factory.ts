import factory from '@adonisjs/lucid/factories'
import Configuration from '#models/configuration'

export const ConfigurationFactory = factory
  .define(Configuration, async ({ faker }) => {
    return {}
  })
  .build()