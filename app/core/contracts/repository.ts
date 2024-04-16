import { ModelId } from './model_id.js'

export default interface Repository {
  getAll(): Promise<any>
  find(id: ModelId): Promise<any>
  findById(id: ModelId): Promise<any>
  create(data: any): Promise<any>
  update(model: any, data: any): Promise<any>
  delete(id: ModelId): Promise<any>
  paginate(options: { page?: number; limit?: number }): Promise<any>
}
