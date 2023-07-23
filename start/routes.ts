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

Route.get("/", () => {
  return {
    apiVersion: "2.0",
  };
}).as("home");

Route.group(() => {
  Route.get("users", "UsersController.index").as("users");
  Route.get("users/:id", "UsersController.show").as("user");
  Route.put("users/:id/fetch-avatar", "UsersController.refetchAvatar").as(
    "refetchAvatar"
  );

  Route.group(() => {
    Route.get("", "RolesController.index").as("index");
    Route.post("", "RolesController.store").as("store");
    Route.get(":id", "RolesController.show").as("show");
    Route.put(":id", "RolesController.update").as("update");
    Route.delete(":id", "RolesController.destroy").as("destroy");
  })
    .prefix("roles")
    .as("roles");

  Route.group(() => {
    Route.get("", "PermissionsController.index").as("index");
    Route.post("", "PermissionsController.store").as("store");
    Route.get(":id", "PermissionsController.show").as("show");
    Route.put(":id", "PermissionsController.update").as("update");
    Route.delete(":id", "PermissionsController.destroy").as("destroy");
  })
    .prefix("permissions")
    .as("permissions");

  Route.get("usages", "StatsController.getAdminUsages").as("usages");
})
  .prefix("administration")
  .as("administration")
  .middleware("auth");

Route.group(() => {
  Route.get("user", "AuthController.auth").middleware("auth").as("user");
  Route.get("user/code", "AuthController.getAccessToken").as("user.getToken");
  Route.post("user/code", "AuthController.generateCode")
    .middleware("auth")
    .as("user.generateCode");
  Route.delete("user", "AuthController.destroy")
    .middleware("auth")
    .as("user.delete.account");
  Route.group(() => {
    Route.get(":provider", "AuthController.redirect").as("redirect");
    Route.post(":provider/callback", "AuthController.authorize").as(
      "authorize"
    );
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
