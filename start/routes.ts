/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("users", "UsersController.index").as("users");
  Route.get("users/:id", "UsersController.show").as("user");

  Route.put("users/:id/fetch-avatar", "UsersController.refetchAvatar").as(
    "refetchAvatar"
  );

  Route.get("usages", "StatsController.getAdminUsages").as("usages");
})
  .prefix("administration")
  .as("administration")
  .middleware("auth")
  .middleware("isAdmin");

Route.group(() => {
  Route.get("user", "AuthController.auth").middleware("auth").as("user");
  Route.delete("user", "AuthController.destroy")
    .middleware("auth")
    .as("user.delete.account");
  Route.group(() => {
    Route.get(":provider", "AuthController.redirect").as("redirect");
    Route.get(":provider/callback", "AuthController.authorize").as("authorize");
  })
    .prefix("oauth2")
    .as("oauth2");

  Route.get("user/logs", "StatsController.getUsages")
    .middleware("auth")
    .as("logs");
})
  .prefix("auth")
  .as("authentification");

Route.get("statistics", "StatsController.get").as("statistic");
Route.post("statistics", "StatsController.store")
  .middleware("throttle:statistic")
  .as("statistic.store");

Route.group(() => {
  Route.get("/", "TestimonialController.get").as("get");
  Route.post("/", "TestimonialController.store").middleware("auth").as("store");
})
  .prefix("testimonials")
  .as("testimonials");

Route.post("/suggestions", "SuggestionsController.store")
  .middleware("auth")
  .as("suggestions.store");
Route.get("suggestions", "SuggestionsController.index").as("suggestions.index");
