import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ContentEntity } from "./content.entity";
import { TranslationsEntity } from "./translations.entity";
import { NewsEntity } from "./news.entity";
import { CoursesEntity } from "./course.entity";
import { BlogsEntity } from "./blogs.entity";
import { ProjectEntity } from "./project.entity";
import { ServiceEntity } from "./service.entity";
import { StudyAreaEntity } from "./studyArea.entity";

@Entity('meta')
export class MetaEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slug: string;

    @ManyToOne(() => NewsEntity, news => news.meta, { nullable: true, onDelete: 'CASCADE' })
    news: NewsEntity;

    @ManyToOne(() => ServiceEntity, service => service.meta, { nullable: true, onDelete: 'CASCADE' })
    service: ServiceEntity;

    @ManyToOne(() => StudyAreaEntity, studyArea => studyArea.meta, { nullable: true, onDelete: 'CASCADE' })
    studyArea: StudyAreaEntity;

    @ManyToOne(() => ProjectEntity, project => project.meta, { nullable: true, onDelete: 'CASCADE' })
    project: ProjectEntity;

    @ManyToOne(() => BlogsEntity, blogs => blogs.meta, { nullable: true, onDelete: 'CASCADE' })
    blogs: BlogsEntity;

    @OneToMany(() => TranslationsEntity, translation => translation.meta, { cascade: true, nullable: true })
    translations: TranslationsEntity[];

    @ManyToOne(() => CoursesEntity, course => course.meta)
    course: CoursesEntity;
}