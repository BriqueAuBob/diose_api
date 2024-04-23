import { column } from '@adonisjs/lucid/orm'

const decorator = (params?: any) => {
  return (target: any, field: string) => {
    column(params)(target, field)
    Reflect.defineMetadata('translatable', target.table, target, field)
  }
}

export default decorator
