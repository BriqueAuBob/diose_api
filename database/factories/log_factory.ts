import factory from '@adonisjs/lucid/factories'
import Log from '../../app/core/models/log.js'

export const LogFactory = factory
  .define(Log, async ({ faker }) => {
    return {}
  })
  .build()
