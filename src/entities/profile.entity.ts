import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UploadEntity } from "./upload.entity";
import { TranslationsEntity } from "./translations.entity";
import { StudyAreaEntity } from "./studyArea.entity";

@Entity('profiles')
export class ProfilesEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    speciality: string;

    @Column()
    model: string;

    @OneToMany(() => TranslationsEntity, translation => translation.profile, { eager: true, cascade: true, nullable: true })
    translations: TranslationsEntity[];

    @ManyToOne(() => StudyAreaEntity, study => study.profile, { onDelete: 'CASCADE', nullable: true })
    studyArea: StudyAreaEntity;

    @OneToOne(() => UploadEntity, upload => upload.profile)
    @JoinColumn()
    image: UploadEntity;
}