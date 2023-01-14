import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import User from "App/Models/User";
import axios from "axios";

export default class AuthController {
  public async redirect({ ally, request }: HttpContextContract) {
    let redirect = await ally.use(request.param("provider")).redirectUrl();
    return {
      success: true,
      redirect,
    };
  }

  public async authorize({ ally, request, auth }: HttpContextContract) {
    const provider = await ally.use(request.param("provider"));

    /**
     * User has explicitly denied the login request
     */
    if (provider.accessDenied()) {
      return "Access was denied";
    }

    /**
     * Unable to verify the CSRF state
     */
    if (provider.stateMisMatch()) {
      return "Request expired. Retry again";
    }

    /**
     * There was an unknown error during the redirect
     */
    if (provider.hasError()) {
      return provider.getError();
    }

    try {
      /**
       * Get the user profile from the provider
       */
      const user = await provider.user();

      /**
       * Find or create a user using the provider's user id
       */
      const dbUser = await User.updateOrCreate(
        {
          discord_id: user.id,
        },
        {
          discord_id: user.id,
          email: user.email,
          username: user.nickName,
          discriminator: user.original.discriminator,
          avatar: user.avatarUrl,
        }
      );

      const code = Math.random().toString(36).substring(2, 15);
      dbUser.code = code;
      dbUser.save();

      /**
       * Generate token from user
       */
      const token = await auth.use("api").generate(dbUser, {
        expiresIn: "7days",
      });

      /**
       * Get user guilds owned
       */
      const { data } = await axios.get(
        "https://discord.com/api/v8/users/@me/guilds",
        {
          headers: {
            Authorization: "Bearer " + user.token.token,
          },
        }
      );
      // @ts-ignore
      const guilds = data.filter((guild) => guild.owner);

      return {
        success: true,
        user: dbUser,
        guilds,
        token,
        code,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  }

  public async auth({ auth }) {
    return {
      user: { sucess: true, ...auth.user.$original },
    };
  }

  public async destroy({ auth }) {
    auth.user.delete();
    return {
      success: true,
    };
  }

  public async generateCode({ auth }) {
    const code = Math.random().toString(36).substring(2, 15);
    auth.user.code = code;
    auth.user.save();
    return {
      success: true,
      code,
    };
  }

  public async getAccessToken({ auth, request }) {
    const user = await User.findBy("code", request.qs().code);
    if (user) {
      user.code = null;
      user.save();

      const token = await auth.use("api").generate(user, {
        expiresIn: "7days",
      });

      return {
        success: true,
        user: user?.$original,
        token,
      };
    } else {
      return {
        success: false,
        message: "Invalid code",
      };
    }
  }
}
