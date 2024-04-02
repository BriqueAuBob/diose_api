import Log from '#core/models/log'
import BaseRepository from '#core/repositories/base'

export default class LogRepository extends BaseRepository<typeof Log> {
  protected model = Log
}
