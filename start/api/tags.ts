import router from '@adonisjs/core/services/router'
import TagsController from '#tags/controllers/tags_controller'

router.resource('/tags', TagsController).only(['index', 'show'])
