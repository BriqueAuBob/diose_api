import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
    Route.get('user', 'AuthController.auth').middleware('auth').as('user');
    Route.get('user/code', 'AuthController.getAccessToken').as('user.getToken');
    Route.post('user/code', 'AuthController.generateCode').middleware('auth').as('user.generateCode');
    Route.delete('user', 'AuthController.destroy').middleware('auth').as('user.delete.account');
    Route.group(() => {
        Route.get(':provider', 'AuthController.redirect').as('redirect');
        Route.post(':provider/callback', 'AuthController.authorize').as('authorize');
    })
        .prefix('oauth2')
        .as('oauth2');

    Route.get('user/logs', 'StatsController.getUsages').middleware('auth').as('logs');

    Route.get('user/guilds', 'AuthController.getGuilds').middleware('auth').as('guilds');
})
    .prefix('auth')
    .as('authentification');
