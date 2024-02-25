import User from '#models/user'
import Log from '#models/log'

export default class Logs {
  async store(level: 'info' | 'warning' | 'error', message: string, user?: User) {
    const log = new Log()
    log.level = level
    log.message = message
    if (user) {
      log.userId = user.id
    }
    log.level = 'info'
    await log.save()
  }
}
