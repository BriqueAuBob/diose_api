import BaseRepository from '#repositories/base'
import Tag from '#tags/models/tag'

export default class TagRepository extends BaseRepository<typeof Tag> {
  protected model = Tag
}
