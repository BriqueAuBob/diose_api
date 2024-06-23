import { ModelId } from '#contracts/model_id'
import ToolSave from '#makebetter/features/saves/models/save'
import BaseRepository from '#repositories/base'
import { Author } from '#users/services/public_user_serializer'
import ToolSaveTag from '../models/save_tags.js'

export default class SaveRepository extends BaseRepository<typeof ToolSave> {
  protected model = ToolSave

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

  async search(
    query: Record<string, any>,
    qs: Record<string, any> = {
      page: 1,
      per_page: 20,
    }
  ) {
    const saves = await this.model
      .query()
      .where(query)
      .preload('tags')
      .preload('author')
      .paginate(qs.page || 1, qs.per_page || 20)
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

  async find(id: ModelId): Promise<ToolSave> {
    const save = await super.find(id)
    await save.load('author')
    await save.load('tags')
    return save.serialize({
      relations: {
        author: {
          fields: Author,
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
}
