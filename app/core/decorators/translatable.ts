import Translation from '#models/translation'
import { HttpContext } from '@adonisjs/core/http'
import { BaseModel } from '@adonisjs/lucid/orm'
import { LucidModel, LucidRow, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

const decorator = () => {
  return function decorateHasHook(target: any, field: string) {
    Reflect.defineMetadata('translatable', target.table, target, field)

    const Model = target.constructor as typeof BaseModel
    Model.boot()
    Model.$addColumn(field, {})
    Model.$addComputed(field, {})
    Model.$addColumn('locale', {})
    Model.$addComputed('locale', {})

    // Save translations in database
    Model.before('save', async (modelInstance) => {
      modelInstance.enableForceUpdate()
      if (modelInstance.$attributes[field]) {
        delete modelInstance.$attributes[field]
      }
    })
    Model.after('save', async (modelInstance) => {
      const translations = modelInstance[field as keyof typeof modelInstance]
      if (translations) {
        for (const locale of Object.keys(translations)) {
          const translation = await Translation.updateOrCreate(
            {
              inTable: Model.table,
              field,
              locale,
              recordId: modelInstance.$attributes.id,
            },
            {
              value: translations[locale as keyof typeof translations],
            }
          )
          await translation.save()
        }
      }
    })

    // Load translations from database
    const loadTranslation = async (query: ModelQueryBuilderContract<LucidModel, LucidRow>) => {
      const ctx = HttpContext.getOrFail()
      query
        .leftJoin('translations', function () {
          this.onVal('translations.in_table', Model.table)
            .andOn(`${Model.table}.id`, 'translations.record_id')
            .andOnVal('translations.field', field)
            .andOnVal('translations.locale', ctx.i18n.locale)
        })
        .select(
          Model.table + '.*',
          'translations.locale as locale',
          'translations.value as ' + field
        )
    }
    Model.before('fetch', loadTranslation)
    Model.before('find', loadTranslation)
  }
}

export default decorator
