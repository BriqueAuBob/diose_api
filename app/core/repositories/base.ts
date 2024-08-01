import { ModelId } from '#contracts/model_id'
import Repository from '#contracts/repository'
import { LucidModel, ModelAttributes } from '@adonisjs/lucid/types/model'
import { ExtractModelRelations } from '@adonisjs/lucid/types/relations'

type PaginationOptions = {
  page: number
  limit: number
}

export type { PaginationOptions }

export default abstract class BaseRepository<Model extends LucidModel> implements Repository {
  protected abstract model: Model

  protected abstract relations: Record<ExtractModelRelations<InstanceType<Model>>, string[]>

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

  async search(
    query: Record<string, any>,
    options: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<any> {
    const q = this.model.query()
    q.where(query)
    if (this.relations) {
      Object.entries(this.relations).forEach(([relation, fields]) =>
        q.preload(relation as ExtractModelRelations<InstanceType<Model>>, (builder) => {
          builder.select(fields as string[])
        })
      )
    }
    return await q.paginate(options.page, options.limit)
  }
}
