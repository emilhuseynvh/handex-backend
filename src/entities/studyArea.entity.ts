import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UploadEntity } from "./upload.entity";
import { TranslationsEntity } from "./translations.entity";
import { ProgramEntity } from "./programs.entity";
import { MetaEntity } from "./meta.entity";
import { FaqEntity } from "./faq.entity";
import { ConsultationEntity } from "./consultation.entity";
import { GroupEntity } from "./group.entity";

@Entity('study_area')
export class StudyAreaEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    slug: string;

    @Column()
    color: string;

    @OneToOne(() => UploadEntity, upload => upload.studyArea)
    @JoinColumn({ name: 'imageId', referencedColumnName: 'id' })
    image: UploadEntity;

    @OneToMany(() => TranslationsEntity, translation => translation.studyArea, { cascade: true })
    translations: TranslationsEntity;

    @OneToMany(() => FaqEntity, faq => faq.studyArea, { cascade: true })
    faq: FaqEntity[];

    @OneToMany(() => GroupEntity, group => group.studyArea, { cascade: true, nullable: true })
    groups: GroupEntity[];

    @OneToMany(() => ConsultationEntity, consultation => consultation.course, { cascade: true })
    consultation: ConsultationEntity[];

    @OneToMany(() => ProgramEntity, program => program.studyArea, { cascade: true })
    program: ProgramEntity[];

    @OneToMany(() => MetaEntity, meta => meta.studyArea, { cascade: true })
    meta: MetaEntity;
}