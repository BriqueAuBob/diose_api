import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
    Route.get('channels/:id', 'Discord/ChannelController.show').as('discord.channels.show');
})
    .prefix('discord')
    .as('discord');
