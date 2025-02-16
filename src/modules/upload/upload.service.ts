import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { join } from 'path';
import config from 'src/config';
import { UploadEntity } from 'src/entities/upload.entity';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { Repository } from 'typeorm';
import * as fs from 'fs';

@Injectable()
export class UploadService {
    constructor(
        @InjectRepository(UploadEntity)
        private uploadRepo: Repository<UploadEntity>,
        private i18n: I18nService<I18nTranslations>
    ) { }

    async create(file: Express.Multer.File) {
        const newFile = this.uploadRepo.create({
            filename: file.filename,
            path: config.url + file.path,
            mimetype: file.mimetype,
        });

        return this.uploadRepo.save(newFile);
    }

    async deleteFile(id: number) {
        let image = await this.uploadRepo.findOne({ where: { id } });

        if (!image) throw new NotFoundException(this.i18n.t('error.errors.not_found'));

        const filePath = join(__dirname, '../../../uploads', image.filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await this.uploadRepo.delete(id);

        return {
            message: this.i18n.t('response.deleted')
        };
    }
}
