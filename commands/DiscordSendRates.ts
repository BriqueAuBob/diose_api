import { BaseCommand } from '@adonisjs/core/build/standalone'
import axios from 'axios';
import Config from '@ioc:Adonis/Core/Config'

export default class DiscordSendRates extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'discord:send_rates'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest` 
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call 
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
    
    const { data } = await axios.get('https://api.umaestro.fr/testimonials')

    for(const testimonial of data.testimonials.sort((a,b) => {
        return new Date(a.created_at) < new Date(b.created_at);
    })) {
      await axios.post('https://discordapp.com/api/v8/channels/1011729700558749697/messages', {
          embeds: [{
            author: {
              icon_url: testimonial.author.avatar,
              name: testimonial.author.username
            },
            title: ('<:star_yellow:1011743974039507084> ').repeat(testimonial.star) + ('<:star_gray:1011743971850063983> ').repeat(5 - testimonial.star),
            description: testimonial.message,
            color: 3092790,
            timestamp: new Date(testimonial.created_at).toISOString(),
            image: {
              url: 'https://i.imgur.com/kdJejsd.png'
            }
          }]
      }, {
          headers: {
              Authorization: 'Bot ' + Config.get('discord.BOT_TOKEN')
          }
      })
    }

  }
}
