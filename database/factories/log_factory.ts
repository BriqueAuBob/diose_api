import factory from '@adonisjs/lucid/factories'
import Log from '#models/log'

export const LogFactory = factory
  .define(Log, async ({ faker }) => {
    return {}
  })
  .build()