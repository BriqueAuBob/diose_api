import Project from '#projects/models/project'
import BaseRepository from '#repositories/base'

export default class ProjectRepository extends BaseRepository<typeof Project> {
  protected model = Project
}
