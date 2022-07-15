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

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('user', 'AuthController.auth').middleware('auth').as('user')
  Route.group(() => {
    Route.get(':provider', 'AuthController.redirect').as('redirect')
    Route.get(':provider/callback', 'AuthController.authorize').as('authorize')
  }).prefix('oauth2').as('oauth2');
}).prefix('auth').as('authentification');

Route.get('statistics', 'StatsController.get').as('statistic');