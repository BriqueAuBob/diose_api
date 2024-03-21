import Partner from '#partners/models/partner'

export default class PartnerRepository {
  async all() {
    return await Partner.query().orderBy('created_at', 'desc').exec()
  }

  async find(id: number) {
    return await Partner.findOrFail(id)
  }

  async create(data: any) {
    return await Partner.create(data)
  }

  async update(partner: Partner, data: any) {
    partner.merge(data)
    await partner.save()
    return partner
  }

  async delete(partner: Partner) {
    await partner.delete()
  }
}
