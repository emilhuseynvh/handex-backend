import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UploadEntity } from "./upload.entity";
import { TranslationsEntity } from "./translations.entity";
import { ProgramEntity } from "./programs.entity";

@Entity('study_area')
export class StudyAreaEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    slug: string;

    @OneToOne(() => UploadEntity, upload => upload.studyArea)
    @JoinColumn({ name: 'imageId', referencedColumnName: 'id' })
    image: UploadEntity;

    @OneToMany(() => TranslationsEntity, translation => translation.studyArea, { cascade: true })
    translations: TranslationsEntity;

    @OneToMany(() => TranslationsEntity, translations => translations.faq)
    faq: TranslationsEntity;

    @OneToMany(() => ProgramEntity, program => program.studyArea)
    program: ProgramEntity;
}