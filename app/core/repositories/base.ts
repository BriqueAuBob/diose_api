import { ModelId } from '#contracts/model_id'
import { LucidModel, ModelAttributes } from '@adonisjs/lucid/types/model'

export default abstract class BaseRepository<Model extends LucidModel> {
  protected abstract model: Model

  async getAll() {
    return this.model.all()
  }

  async find(id: ModelId) {
    return this.model.findOrFail(id)
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
    console.log('model', model)
    model.merge(data)
    return model.save()
  }

  async delete(id: ModelId) {
    const model = await this.find(id)
    await model.delete()
    return model
  }
}
