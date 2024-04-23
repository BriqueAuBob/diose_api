import ToolSave from '#makebetter/features/saves/models/save'
import BaseRepository from '#repositories/base'

export default class SaveRepository extends BaseRepository<typeof ToolSave> {
  protected model = ToolSave
}
