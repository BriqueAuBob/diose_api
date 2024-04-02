import { ModelId } from '#contracts/model_id'
import { LucidModel, ModelAttributes } from '@adonisjs/lucid/types/model'

type PaginationOptions = {
  page?: number
  limit?: number
}

export default abstract class BaseRepository<Model extends LucidModel> {
  protected abstract model: Model

  async getAll() {
    return await this.model.all()
  }

  async find(id: ModelId) {
    return await this.model.findOrFail(id)
  }

  async findById(id: ModelId) {
    return await this.find(id)
  }

  async create(data: Partial<ModelAttributes<InstanceType<Model>>>): Promise<InstanceType<Model>> {
    return await this.model.create(data)
  }

  async update(
    model: InstanceType<Model> | ModelId,
    data: Partial<ModelAttributes<InstanceType<Model>>>
  ) {
    if (typeof model === 'number' || typeof model === 'string') {
      model = await this.find(model)
    }
    model.merge(data)
    return model.save()
  }

  async delete(id: ModelId) {
    const model = await this.find(id)
    await model.delete()
    return model
  }

  async paginate({ page = 1, limit = 10 }: PaginationOptions) {
    return this.model.query().paginate(page, limit)
  }
}
