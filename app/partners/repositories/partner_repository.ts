import Partner from '#partners/models/partner'
import BaseRepository from '#repositories/base'

export default class PartnerRepository extends BaseRepository<typeof Partner> {
  protected model = Partner
}
