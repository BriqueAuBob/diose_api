import Log from '../models/log.js'

export default class LogRepository {
  public async getAll() {
    return await Log.all()
  }
}
