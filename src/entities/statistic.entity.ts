import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TranslationsEntity } from "./translations.entity";
import { StudyAreaEntity } from "./studyArea.entity";

@Entity('statistic')
export class StatisticEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    count: string;

    @Column()
    field: string;

    @OneToMany(() => TranslationsEntity, translation => translation.statistic, { cascade: true, eager: true })
    translations: TranslationsEntity[];

    @ManyToOne(() => StudyAreaEntity, study => study.statistic, { onDelete: 'CASCADE', nullable: true })
    studyArea: StudyAreaEntity;
}