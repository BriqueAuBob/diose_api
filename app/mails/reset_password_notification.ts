import User from '#models/user'
import router from '@adonisjs/core/services/router'
import { BaseMail } from '@adonisjs/mail'

export default class ResetPasswordNotification extends BaseMail {
  from = 'support@diose.io'
  subject = 'Réinitialisation de mot de passe'

  constructor(private user: User) {
    super()
  }

  async prepare() {
    const token = await User.resetPasswordTokens.create(this.user, ['*'], {
      expiresIn: '1h',
    })
    const signedUrl = router
      .builder()
      .prefixUrl('http://localhost:5173')
      .disableRouteLookup()
      .params({ token: token.toJSON().token })
      .make('reset-password/:token')

    this.message.to(this.user.email)
    this.message.htmlView('emails/reset_password_html', {
      user: this.user,
      signedUrl: signedUrl,
    })
    this.message.textView('emails/reset_password_text', {
      user: this.user,
      signedUrl: signedUrl,
    })
  }
}
