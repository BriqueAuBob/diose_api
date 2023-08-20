import Application from '@ioc:Adonis/Core/Application';
import Route from '@ioc:Adonis/Core/Route';
import Env from '@ioc:Adonis/Core/Env';
import sharp from 'sharp';

export default class UploadController {
    public async show({ request, response }) {
        const { name } = request.params();
        return response.download(Application.tmpPath(`uploads/${name}`));
    }

    public async upload({ request, response }) {
        const file = request.file('file', {
            size: '2mb',
            extnames: ['jpg', 'png', 'jpeg'],
        });
        if (!file) {
            return response.badRequest('No file');
        }
        const image = await sharp(file.tmpPath).resize(450).toBuffer();
        await sharp(image).toFile(file.tmpPath);
        await file.move(Application.tmpPath('uploads'), {
            name: `${new Date().getTime()}.${file.extname}`,
            ensureUniquefileName: true,
        });
        if (file.state !== 'moved') {
            return response.badRequest(file.errors);
        }
        return response.ok({
            url: Route.makeUrl(
                'uploads.show',
                { name: file.fileName },
                {
                    prefixUrl: Env.get('APP_URL'),
                }
            ),
            urlWithoutPrefix: Route.makeUrl('uploads.show', { name: file.fileName }),
        });
    }
}
