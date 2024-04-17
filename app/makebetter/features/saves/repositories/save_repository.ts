import MongoRepository from '#repositories/mongo'
import Save, { ToolSaveDocument } from '#makebetter/features/saves/models/save'

export default class SaveRepository extends MongoRepository<typeof Save, ToolSaveDocument> {
  protected model = Save
}
