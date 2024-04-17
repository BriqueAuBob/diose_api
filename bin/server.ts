/*
|--------------------------------------------------------------------------
| HTTP server entrypoint
|--------------------------------------------------------------------------
|
| The "server.ts" file is the entrypoint for starting the AdonisJS HTTP
| server. Either you can run this file directly or use the "serve"
| command to run this file and monitor file changes
|
*/

import 'reflect-metadata'
import { Ignitor, prettyPrintError } from '@adonisjs/core'
import { BaseModel, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'

import mongoose from 'mongoose'
import env from '#start/env'

/**
 * URL to the application root. AdonisJS need it to resolve
 * paths to file and directories for scaffolding commands
 */
const APP_ROOT = new URL('../', import.meta.url)

/**
 * The importer is used to import files in context of the
 * application.
 */
const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }
  return import(filePath)
}

// Set the naming strategy for Lucid models to snake_case naming
// eg: avatarUrl will be converted to avatar_url in SQL queries and JSON responses
BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

new Ignitor(APP_ROOT, { importer: IMPORTER })
  .tap((app) => {
    app.booting(async () => {
      await import('#start/env')
      await import('#start/sockets')

      try {
        await mongoose.connect(env.get('MONGO_URL'))
        console.log('INFO - Connected to MongoDB')
        await import('#makebetter/features/saves/models/save')
      } catch (error) {
        console.error(error)
        process.exit(1)
      }
    })
    app.listen('SIGTERM', () => app.terminate())
    app.listenIf(app.managedByPm2, 'SIGINT', () => app.terminate())
  })
  .httpServer()
  .start()
  .catch((error) => {
    process.exitCode = 1
    prettyPrintError(error)
  })
