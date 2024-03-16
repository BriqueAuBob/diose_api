export type DiscordWebhookMessage = {
  content?: string
  username?: string
  avatar_url?: string
  embeds?: {
    title?: string
    description?: string
    color?: number
    fields: {
      name: string
      value: string
      inline?: boolean
    }[]
  }[]
}
