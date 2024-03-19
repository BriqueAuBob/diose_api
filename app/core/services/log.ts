import User from '../../users/models/user.js'
import Log from '../models/log.js'
import { DiscordWebhookMessage } from '../contracts/discord_webhook_message.js'
import config from '@adonisjs/core/services/config'

type Level = 'info' | 'warning' | 'error'
type Context = { user?: User; webhookUrl?: string; configWebhookUrlKey?: string }

export default class Logs {
  async store(level: Level, message: string | DiscordWebhookMessage, ctx?: Context) {
    const log = new Log()
    log.level = level
    if (typeof message === 'string') {
      log.message = message
    } else {
      log.message = message.content!
    }
    if (ctx?.user) {
      log.userId = ctx?.user?.id
    }
    log.level = 'info'
    await log.save()

    if (ctx?.webhookUrl || ctx?.configWebhookUrlKey) {
      await this.sendToDiscord(
        typeof message === 'string'
          ? ({
              content: message,
            } as DiscordWebhookMessage)
          : { ...message, content: undefined },
        (ctx?.configWebhookUrlKey
          ? config.get('dynamic.logsChannels.' + ctx?.configWebhookUrlKey)
          : ctx?.webhookUrl)!
      )
    }
  }

  async info(message: string, ctx?: Context) {
    await this.store('info', message, ctx)
  }

  async warning(message: string, ctx?: Context) {
    await this.store('warning', message, ctx)
  }

  async error(message: string, ctx?: Context) {
    await this.store('error', message, ctx)
  }

  private async sendToDiscord(message: DiscordWebhookMessage, webhookUrl: string) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
  }
}
