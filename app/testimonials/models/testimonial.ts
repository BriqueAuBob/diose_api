import { DateTime } from 'luxon'
import { BaseModel, afterCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '../../auth/models/user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Project from '../../projects/models/project.js'
import bots, { Routes } from '#services/discord'
import config from '@adonisjs/core/services/config'

export default class Testimonial extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ serializeAs: null })
  declare authorId: number

  @belongsTo(() => User, {
    foreignKey: 'authorId',
  })
  declare author: BelongsTo<typeof User>

  @column({ serializeAs: null })
  declare projectId: number

  @belongsTo(() => Project, {
    foreignKey: 'projectId',
  })
  declare project: BelongsTo<typeof Project>

  @column()
  declare content: string

  @column()
  declare stars: number

  @column()
  declare isVisible: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterCreate()
  static async onCreateTestimonial(testimonial: Testimonial) {
    await testimonial.load('author')
    await testimonial.load('project')

    try {
      bots.diose.post(Routes.channelMessages(config.get('dynamic.discord.channels.testimonials')), {
        body: {
          embeds: [
            {
              title: `New ${testimonial.project.title}'s testimonial`,
              author: {
                name: testimonial.author.username,
                icon_url: testimonial.author.avatarUrl,
              },
              description: `${'⭐️'.repeat(testimonial.stars)}\n${testimonial.content}`,
              color: 0x2b2d31,
            },
          ],
        },
      })
    } catch (error: any) {
      console.log(error)
    }
  }
}
