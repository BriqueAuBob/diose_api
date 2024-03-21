import PartnerRepository from '#partners/repositories/partner_repository'
import { partnerValidator } from '#partners/validators/partner'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AdminPartnersController {
  constructor(private partnerRepository: PartnerRepository) {}

  async index() {
    return await this.partnerRepository.all()
  }

  async show({ params: { id } }: HttpContext) {
    return await this.partnerRepository.find(id)
  }

  async store({ request }: HttpContext) {
    return await this.partnerRepository.create(await request.validateUsing(partnerValidator))
  }

  async update({ params: { id }, request }: HttpContext) {
    const partner = await this.partnerRepository.find(id)
    return await this.partnerRepository.update(
      partner,
      await request.validateUsing(partnerValidator)
    )
  }

  async destroy({ params: { id } }: HttpContext) {
    const partner = await this.partnerRepository.find(id)
    return await this.partnerRepository.delete(partner)
  }
}
