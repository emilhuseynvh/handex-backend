import { Lang } from "src/shares/enums/lang.enum";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ContentEntity } from "./content.entity";
import { MetaEntity } from "./meta.entity";
import { NewsEntity } from "./news.entity";
import { CoursesEntity } from "./course.entity";
import { CustomersEntity } from "./customers.entity";
import { StudyAreaEntity } from "./studyArea.entity";
import { ProgramEntity } from "./programs.entity";

@Entity('translations')
export class TranslationsEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    field: string;

    @Column()
    model: string;

    @Column({ type: 'enum', enum: Lang, default: Lang.AZ })
    lang: Lang;

    @Column({ nullable: true })
    value: string;

    @ManyToOne(() => ContentEntity, content => content.translations, { onDelete: 'CASCADE' })
    content: ContentEntity;

    @ManyToOne(() => ProgramEntity, program => program.translations, { onDelete: 'CASCADE' })
    program: ContentEntity;

    @ManyToOne(() => StudyAreaEntity, study => study.translations, { onDelete: 'CASCADE' })
    studyArea: StudyAreaEntity;

    @ManyToOne(() => StudyAreaEntity, study => study.faq, { onDelete: 'CASCADE' })
    faq: StudyAreaEntity;

    @ManyToOne(() => CustomersEntity, customer => customer.translations, { onDelete: 'CASCADE' })
    customers: CustomersEntity;

    @ManyToOne(() => NewsEntity, news => news.translations, { onDelete: 'CASCADE' })
    news: NewsEntity;

    @ManyToOne(() => MetaEntity, meta => meta.translations, { onDelete: 'CASCADE' })
    meta: MetaEntity;

    @ManyToOne(() => CoursesEntity, course => course)
    course: CoursesEntity;
}