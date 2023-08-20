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

// import fs from 'fs';
import Route from '@ioc:Adonis/Core/Route';

Route.get('/', () => {
    return {
        apiVersion: '2.0',
    };
}).as('home');

Route.get('statistics', 'StatsController.get').as('statistic');
Route.post('statistics', 'StatsController.store').middleware('throttle:statistic').as('statistic.store');

Route.get('users', 'UsersController.indexSmall').as('users');

Route.group(() => {
    Route.get('/', 'TestimonialController.get').as('get');
    Route.post('/', 'TestimonialController.store').middleware('auth').as('store');
})
    .prefix('testimonials')
    .as('testimonials');

Route.post('/suggestions', 'SuggestionsController.store').middleware('auth').as('suggestions.store');
Route.get('suggestions', 'SuggestionsController.index').as('suggestions.index');

Route.get('articles', 'ArticlesController.index').as('articles.index');
Route.get('articles/:slug', 'ArticlesController.show').middleware('silentAuth').as('articles.show');

// import routes from './routes';
import './routes/auth';
import './routes/admin';
import './routes/discord';
import './routes/tools';
import './routes/upload';
