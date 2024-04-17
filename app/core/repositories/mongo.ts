import Repository from '#contracts/repository'
import { Model } from 'mongoose'

export default abstract class MongoRepository<T extends Model<A>, A> implements Repository {
  protected abstract model: T

  async getAll() {
    return await this.model.find()
  }

  async find(id: any) {
    return await this.model.findOne({ _id: id })
  }

  async findById(id: any) {
    return await this.find(id)
  }

  async create(data: any) {
    return await this.model.create(data)
  }

  async update(model: any, data: any) {
    return await this.model.updateOne({ _id: model._id }, data)
  }

  async delete(id: any) {
    return await this.model.deleteOne({ _id: id })
  }

  async paginate(options: { page?: number; limit?: number }) {
    const page = options.page || 1
    const limit = options.limit || 10
    return await this.model
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
  }
}
