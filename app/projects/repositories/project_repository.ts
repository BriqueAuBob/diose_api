import Project from '#projects/models/project'

export default class ProjectRepository {
  async all() {
    return await Project.query().orderBy('created_at', 'desc').exec()
  }

  async find(id: number) {
    return await Project.findOrFail(id)
  }

  async create(data: any) {
    return await Project.create(data)
  }

  async update(project: Project, data: any) {
    project.merge(data)
    await project.save()
    return project
  }

  async delete(project: Project) {
    await project.delete()
  }
}
