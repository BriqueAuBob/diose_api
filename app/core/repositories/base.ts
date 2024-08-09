import { ModelId } from '#contracts/model_id'
import Repository from '#contracts/repository'
import { LucidModel, ModelAttributes } from '@adonisjs/lucid/types/model'
import { ExtractModelRelations } from '@adonisjs/lucid/types/relations'
import { visitLexicalEnvironment } from 'typescript'

type PaginationOptions = {
  page: number
  limit: number
}

export type { PaginationOptions }

export default abstract class BaseRepository<Model extends LucidModel> implements Repository {
  protected abstract model: Model

  protected relations?: Record<ExtractModelRelations<InstanceType<Model>>, string[]>

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
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined) return
      if (this.isRelationship(key)) return
      this.handleValue(q, key, value)
    })
    if (this.relations) {
      Object.entries(this.relations).forEach(([relation, fields]) => {
        q.preload(relation as ExtractModelRelations<InstanceType<Model>>, (builder) => {
          builder.select(fields as string[])
        })
        // check if query params contains relation
        const queryRelationships = this.findQueryForRelationship(relation, query)
        console.log(queryRelationships)
        for (const property in queryRelationships) {
          const value = queryRelationships[property]
          if (Array.isArray(value.value)) {
            q.andWhereHas(property as ExtractModelRelations<InstanceType<Model>>, (b) => {
              console.log('prop', property, value)
              b.whereIn(value.key, value.value)
            })
          }
        }
      })
    }
    return await q.paginate(options.page, options.limit)
  }

  private isRelationship(field: string) {
    const splitted = field.split('.')
    if (splitted?.[0] && this.relations) {
      return new Boolean(
        this.relations[splitted?.[0] as ExtractModelRelations<InstanceType<Model>>]
      )
    }
    return false
  }

  private findQueryForRelationship(relation: string, query: Record<string, any>) {
    const queryRelationships: {
      [key: string]: {
        key: string
        value: any
      }
    } = {}
    for (const property in query) {
      const splitted = property.split('.')
      console.log('property', property, splitted, query[property])
      if (splitted?.[0] && splitted?.[1]) {
        queryRelationships[relation] = {
          key: splitted[1],
          value: query[property],
        }
      }
    }
    return queryRelationships
  }

  // Methods used to handle different types of query values
  private handleArrayValue(q: any, key: string, value: any[]) {
    q.whereIn(key, value)
  }

  private handleStringValue(q: any, key: string, value: string) {
    if (value === '') return
    if (value.includes('%')) {
      q.where(key, 'LIKE', value)
    } else {
      q.where(key, value)
    }
  }

  private handleValue(q: any, key: string, value: any) {
    if (Array.isArray(value)) {
      this.handleArrayValue(q, key, value)
    } else if (typeof value === 'string') {
      this.handleStringValue(q, key, value)
    } else {
      q.where(key, value)
    }
  }
}
