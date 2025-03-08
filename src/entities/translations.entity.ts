import { Lang } from "src/shares/enums/lang.enum";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ContentEntity } from "./content.entity";
import { MetaEntity } from "./meta.entity";
import { NewsEntity } from "./news.entity";

@Entity('translations')
export class TranslationsEntity {
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

    @ManyToOne(() => NewsEntity, news => news.translations, { onDelete: 'CASCADE' })
    news: NewsEntity;

    @ManyToOne(() => MetaEntity, meta => meta.translations, { onDelete: 'CASCADE' })
    meta: MetaEntity;
}