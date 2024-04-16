import Repository from '#contracts/repository'
import { Collection, FindCursor, WithId, Document } from 'mongodb'

export default abstract class MongoRepository<Model extends Collection> implements Repository {
  protected abstract model: Model

  async getAll(): Promise<FindCursor<WithId<Document>>> {
    return await this.model.find()
  }

  async find(id: any): Promise<WithId<Document> | null> {
    return await this.model.findOne({ _id: id })
  }

  async findById(id: any): Promise<WithId<Document> | null> {
    return await this.find(id)
  }

  async create(data: any): Promise<any> {
    throw new Error('Method not implemented.')
  }

  async update(model: any, data: any): Promise<any> {
    throw new Error('Method not implemented.')
  }

  async delete(id: any): Promise<any> {
    throw new Error('Method not implemented.')
  }

  async paginate(options: { page?: number; limit?: number }): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
