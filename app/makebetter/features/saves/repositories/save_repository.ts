import MongoRepository from '#repositories/mongo'
import Save from '#makebetter/features/saves/models/save'

export default class SaveRepository extends MongoRepository<typeof Save> {
  protected model = Save
}
