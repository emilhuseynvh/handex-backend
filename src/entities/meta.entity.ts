import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ContentEntity } from "./content.entity";
import { TranslationsEntity } from "./translations.entity";
import { NewsEntity } from "./news.entity";
import { CoursesEntity } from "./course.entity";

@Entity('meta')
export class MetaEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ContentEntity, content => content.meta, { onDelete: 'CASCADE', nullable: true })
    content: ContentEntity;

    @ManyToOne(() => NewsEntity, news => news.meta, { nullable: true, onDelete: 'CASCADE' })
    news: NewsEntity;

    @OneToMany(() => TranslationsEntity, translation => translation.meta, { cascade: true, nullable: true })
    translations: TranslationsEntity[];

    @ManyToOne(() => CoursesEntity, course => course.meta)
    course: CoursesEntity
}