/*
|--------------------------------------------------------------------------
| Define HTTP rate limiters
|--------------------------------------------------------------------------
|
| The "Limiter.define" method callback receives an instance of the HTTP
| context you can use to customize the allowed requests and duration
| based upon the user of the request.
|
*/

import { Limiter } from "@adonisjs/limiter/build/services";

export const { httpLimiters } = Limiter.define(
  "statistic",
  async ({ auth }) => {
    if (await auth.use("api").check()) {
      return Limiter.allowRequests(25)
        .every("1 min")
        .usingKey("user_" + auth?.user?.id.toString());
    }
    return Limiter.allowRequests(5).every("1 min");
  }
);
