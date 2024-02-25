import Log from '#models/log'

export default class LogRepository {
  public async getAll() {
    return await Log.all()
  }
}
