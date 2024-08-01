import BaseRepository from '#repositories/base'
import { HttpContext } from '@adonisjs/core/http'

export default class PaginationService {
  async search(
    repository: any extends BaseRepository<infer Model> ? BaseRepository<Model> : never,
    query: Record<string, any>
  ) {
    const httpContext = HttpContext.get()
    const { page = 1, limit = 20 } = httpContext?.request?.qs() as Record<string, any>
    if (limit > 100) {
      return httpContext?.response.abort(
        {
          message: 'Limit should be less than or equal to 100',
          status: 400,
        },
        400
      )
    }
    return await repository.search(query, { page, limit })
  }
}
