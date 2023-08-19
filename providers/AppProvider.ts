import { ApplicationContract } from '@ioc:Adonis/Core/Application';

export default class AppProvider {
    constructor(protected app: ApplicationContract) {}

    public register() {}

    public async boot() {
        const { DatabaseQueryBuilder, ModelQueryBuilder } = this.app.container.use('Adonis/Lucid/Database');

        DatabaseQueryBuilder.macro('getCount', async function () {
            const result = await this.count('* as total');
            return BigInt(result[0].total);
        });

        ModelQueryBuilder.macro('getCount', async function () {
            const result = await this.count('* as total');
            return BigInt(result[0].$extras.total);
        });
    }

    public async ready() {
        await import('../start/mongodb');
        await import('../start/socket');
    }

    public async shutdown() {
        // Cleanup, since app is going down
    }
}
