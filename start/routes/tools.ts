import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
    Route.group(() => {
        Route.get('saves', 'MakeBetter/SavesController.index').middleware('silentAuth').as('saves.index');
        Route.get('saves/:id', 'MakeBetter/SavesController.show').middleware('silentAuth').as('saves.show');
        Route.put('saves/:id', 'MakeBetter/SavesController.update').middleware('auth').as('saves.update');
        Route.get('saves/:id/permissions', 'MakeBetter/SavesController.permissions')
            .middleware('auth')
            .as('saves.permissions');
        Route.put('saves/:id/permissions', 'MakeBetter/SavesController.permissionsSet')
            .middleware('auth')
            .as('saves.permissions.set');
        Route.post('saves', 'MakeBetter/SavesController.store').as('saves.store').middleware('auth');
    })
        .as('tools')
        .prefix('tools');
})
    .prefix('makebetter')
    .as('makebetter.');
