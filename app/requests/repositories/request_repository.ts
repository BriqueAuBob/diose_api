import Request from '#requests/models/request'

export default class RequestRepository {
  public async getAll() {
    return Request.all()
  }

  public async find(id: number) {
    return Request.findOrFail(id)
  }

  public async create(data: any) {
    return Request.create(data)
  }

  public async update(id: Request | number, data: any) {
    const request = typeof id === 'number' ? await Request.findOrFail(id) : id
    request.merge(data)
    await request.save()
    return request
  }

  public async delete(id: number) {
    const request = await Request.findOrFail(id)
    await request.delete()
  }
}
