import ToolSave from '#makebetter/features/saves/models/save'
import BaseRepository from '#repositories/base'
import { Author } from '#users/services/public_user_serializer'

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
}
