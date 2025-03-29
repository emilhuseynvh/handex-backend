import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import config from 'src/config';

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: config.cloudinaryCloudName,
            api_key: config.cloudinaryApiKey,
            api_secret: config.cloudinaryApiToken,
        });
    }

    async uploadFile(file: Express.Multer.File) {
        const result: any = await new Promise((resolve, reject) =>
            cloudinary.uploader
                .upload_stream((err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                })
                .end(file.buffer),
        );

        return { url: result?.url, type: file.mimetype };
    }
}
