import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TranslationsEntity } from "./translations.entity";
import { StudyAreaEntity } from "./studyArea.entity";

@Entity('faq')
export class FaqEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => TranslationsEntity, translation => translation.faq, { cascade: true })
    translations: TranslationsEntity[];

    @ManyToOne(() => StudyAreaEntity, study => study.faq, { onDelete: 'CASCADE' })
    studyArea: StudyAreaEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}