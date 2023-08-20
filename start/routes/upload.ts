import Route from '@ioc:Adonis/Core/Route';

Route.get('uploads/:name', 'UploadController.show').as('uploads.show');
Route.post('uploads', 'UploadController.upload').as('uploads.store');
