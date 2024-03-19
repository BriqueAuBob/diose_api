import User from '../../users/models/user.js'
import router from '@adonisjs/core/services/router'
import { BaseMail } from '@adonisjs/mail'

export default class ResetPasswordNotification extends BaseMail {
  from = 'support@diose.io'
  subject = 'Réinitialisation de mot de passe'

  constructor(private user: User) {
    super()
  }

  async prepare() {
    const token = await User.resetPasswordTokens.create(this.user, ['*'])
    const url = router
      .builder()
      .prefixUrl('http://localhost:5173')
      .disableRouteLookup()
      .params({ token: token.toJSON().token })
      .make('reset-password/:token')

    this.message.to(this.user.email)
    this.message.htmlView('emails/reset_password_html', {
      user: this.user,
      url,
    })
    this.message.textView('emails/reset_password_text', {
      user: this.user,
      url,
    })
  }
}
