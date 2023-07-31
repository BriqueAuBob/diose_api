import User from 'App/Models/User';
import Factory from '@ioc:Adonis/Lucid/Factory';

export default Factory.define(User, ({ faker }: any) => {
    return {
        discord_id: faker.random.numeric(18),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        discriminator: faker.random.numeric(4),
        avatar: faker.image.avatar(),
    };
}).build();
