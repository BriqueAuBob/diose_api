import { ModelId } from '#contracts/model_id'
import ToolSave from '#makebetter/features/saves/models/save'
import BaseRepository, { PaginationOptions } from '#repositories/base'
import { Author } from '#users/services/public_user_serializer'
import ToolSaveTag from '../models/save_tags.js'

export default class SaveRepository extends BaseRepository<typeof ToolSave> {
  protected model = ToolSave

  protected relations = {
    author: ['id', 'username', 'avatarUrl'],
    tags: [],
    members: ['id', 'user_id', 'role'],
  }

  async getAll() {
    const saves = await this.model.query().preload('tags').preload('author')
    return saves.map((save) =>
      save.serialize({
        relations: {
          author: {
            fields: Author,
          },
        },
      })
    ) as ToolSave[]
  }

  async search(query: Record<string, any>, options: PaginationOptions = { page: 1, limit: 10 }) {
    return (await super.search(query, options)).serialize({
      relations: {
        author: {
          fields: Author,
        },
        members: {
          fields: ['id', 'role'],
          relations: {
            user: {
              fields: ['id', 'username', 'avatarUrl'],
            },
          },
        },
        tags: {
          fields: ['id', 'name', 'color'],
        },
      },
    })
  }

  async find(id: ModelId): Promise<ToolSave> {
    const save = await super.find(id)
    await save.load('author')
    await save.load('tags')
    await save.load('members')
    return save.serialize({
      relations: {
        author: {
          fields: Author,
        },
        members: {
          fields: ['id', 'role'],
          relations: {
            user: {
              fields: ['id', 'username', 'avatar_url'],
            },
          },
        },
      },
    }) as ToolSave
  }

  async create(data: Record<string, any>): Promise<ToolSave> {
    const save = await super.create(data)
    await ToolSaveTag.createMany(data.tags.map((tagId: number) => ({ tagId, saveId: save.id })))
    return save
  }

  async update(id: ModelId, data: Record<string, any>): Promise<ToolSave> {
    const save = await super.update(id, data)
    await ToolSaveTag.query().where('saveId', id).delete()
    await ToolSaveTag.createMany(data.tags.map((tagId: number) => ({ tagId, saveId: save.id })))
    return save
  }

  async getMembers(id: ModelId) {
    const save = await super.find(id)
    await save.load('members')
    const members = save.members.map((member) => member.serialize()) as Record<string, any>[]
    await save.load('author')
    members.push({
      userId: save.authorId,
      role: 'admin',
      user: save.author,
    })
    return members
  }

  async updateMembers(id: ModelId, members: Record<string, any>[]): Promise<ToolSave> {
    const save = await super.find(id)
    await save.related('members').query().delete()
    await save
      .related('members')
      .createMany(members.filter((member) => member.userId != save.authorId))
    return save
  }
}
