import Testimonial from "App/Models/Testimonial";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import axios from "axios";
import Config from "@ioc:Adonis/Core/Config";

export default class TestimonialController {
  async get({ response, request }) {
    const testimonials = await Testimonial.query()
      .if(request.qs().max, (query) => {
        query.limit(parseInt(request.qs().max));
      })
      .preload("author")
      .orderByRaw("rand()")
      .select("*");

    return response.json({ success: true, test: true, testimonials });
  }

  async store({ request, response, auth }) {
    const newTestimonial = schema.create({
      message: schema.string([rules.minLength(4), rules.maxLength(500)]),
      star: schema.number([rules.required()]),
    });

    const validated = await request.validate({
      schema: newTestimonial,
      messages: {
        required: "Vous devez dire pour quelle raison vous mettez cet avis.",
        minLength:
          "La raison dois faire au moins {{ options.minLength }} caractères.",
        maxLength:
          "La raison dois faire  {{ options.maxLength }} caractères au maximum.",
        number: "Le nombre d'étoiles dois être un nombre.",
      },
    });
    await Testimonial.create({
      user_id: auth.user.id,
      ...validated,
    });

    axios.post(
      "https://discordapp.com/api/v8/channels/1011729700558749697/messages",
      {
        embeds: [
          {
            author: {
              icon_url: auth.user.avatar,
              name: auth.user.username,
            },
            title:
              "<:star_yellow:1011743974039507084> ".repeat(
                request.input("star")
              ) +
              "<:star_gray:1011743971850063983> ".repeat(
                5 - request.input("star")
              ),
            description: request.input("message"),
            color: 3092790,
            timestamp: new Date().toISOString(),
            image: {
              url: "https://i.imgur.com/kdJejsd.png",
            },
          },
        ],
      },
      {
        headers: {
          Authorization: "Bot " + Config.get("discord.BOT_TOKEN"),
        },
      }
    );

    return response.json({
      message: "Votre avis a bien été publié.",
      success: true,
    });
  }
}
