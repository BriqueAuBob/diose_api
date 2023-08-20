import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
    Route.get('users', 'UsersController.index').as('users');
    Route.get('users/:id', 'UsersController.show').as('user');
    Route.put('users/:id/fetch-avatar', 'UsersController.refetchAvatar').as('refetchAvatar');
    Route.put('users/:id/roles', 'UsersController.setUserRoles').as('setUserRoles');

    Route.group(() => {
        Route.get('', 'RolesController.index').as('index');
        Route.post('', 'RolesController.store').as('store');
        Route.get(':id', 'RolesController.show').as('show');
        Route.put(':id', 'RolesController.update').as('update');
        Route.delete(':id', 'RolesController.destroy').as('destroy');
    })
        .prefix('roles')
        .as('roles');

    Route.group(() => {
        Route.get('', 'PermissionsController.index').as('index');
        Route.post('', 'PermissionsController.store').as('store');
        Route.get(':id', 'PermissionsController.show').as('show');
        Route.put(':id', 'PermissionsController.update').as('update');
        Route.delete(':id', 'PermissionsController.destroy').as('destroy');
    })
        .prefix('permissions')
        .as('permissions');

    Route.get('usages', 'StatsController.getAdminUsages').as('usages');

    Route.group(() => {
        Route.get('', 'ArticlesController.indexAdmin').as('index');
        Route.post('', 'ArticlesController.store').as('store');
        Route.get(':slug', 'ArticlesController.show').as('show');
        Route.put(':slug', 'ArticlesController.update').as('update');
        Route.delete(':slug', 'ArticlesController.destroy').as('destroy');
    })
        .as('articles.')
        .prefix('articles');

    Route.group(() => {
        Route.get('', 'TagsController.index').as('index');
        Route.post('', 'TagsController.store').as('store');
        Route.get(':id', 'TagsController.show').as('show');
        Route.put(':id', 'TagsController.update').as('update');
        Route.delete(':id', 'TagsController.destroy').as('destroy');
    })
        .as('tags.')
        .prefix('tags');
})
    .prefix('administration')
    .as('administration')
    .middleware(['auth', 'permission:view_dashboard']);
