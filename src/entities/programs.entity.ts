import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TranslationsEntity } from "./translations.entity";
import { StudyAreaEntity } from "./studyArea.entity";
import { UploadEntity } from "./upload.entity";

@Entity('programs')
export class ProgramEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => UploadEntity, upload => upload.program)
    image: UploadEntity;

    @ManyToOne(() => StudyAreaEntity, study => study.program, { onDelete: 'CASCADE' })
    studyArea: StudyAreaEntity;

    @OneToMany(() => TranslationsEntity, translations => translations.program, { cascade: true })
    translations: TranslationsEntity[];
}