/**
 * Contract source: https://git.io/JOdiQ
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

declare module '@ioc:Adonis/Addons/Ally' {
    interface SocialProviders {
        github: {
            config: GithubDriverConfig;
            implementation: GithubDriverContract;
        };
        google: {
            config: GoogleDriverConfig;
            implementation: GoogleDriverContract;
        };
        twitter: {
            config: TwitterDriverConfig;
            implementation: TwitterDriverContract;
        };
        discord: {
            config: DiscordDriverConfig;
            implementation: DiscordDriverContract;
        };
    }
}
