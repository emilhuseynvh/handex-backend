import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TranslationsEntity } from "./translations.entity";
import { StudyAreaEntity } from "./studyArea.entity";

@Entity('group')
export class GroupEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => TranslationsEntity, translation => translation.groups, { cascade: true, eager: true })
    table: TranslationsEntity[];

    @Column()
    startDate: string;

    @OneToMany(() => TranslationsEntity, translation => translation.text, { cascade: true, eager: true })
    text: TranslationsEntity[];

    @ManyToOne(() => StudyAreaEntity, study => study.groups, { onDelete: 'CASCADE' })
    studyArea: StudyAreaEntity;
}