import BaseRepository from '#repositories/base'
import Request from '#requests/models/request'

export default class RequestRepository extends BaseRepository<typeof Request> {
  protected model = Request
}
