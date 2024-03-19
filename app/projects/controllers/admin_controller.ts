import ProjectRepository from '#projects/repositories/project_repository'
import { projectValidator } from '#projects/validators/project'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AdminProjectsController {
  private projectRepository: ProjectRepository

  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository
  }

  async index() {
    return await this.projectRepository.all()
  }

  async show({ params: { id } }: HttpContext) {
    return await this.projectRepository.find(id)
  }

  async store({ request }: HttpContext) {
    return await this.projectRepository.create(await request.validateUsing(projectValidator))
  }

  async update({ params: { id }, request }: HttpContext) {
    const project = await this.projectRepository.find(id)
    return await this.projectRepository.update(
      project,
      await request.validateUsing(projectValidator)
    )
  }

  async destroy({ params: { id } }: HttpContext) {
    const project = await this.projectRepository.find(id)
    return await this.projectRepository.delete(project)
  }
}
