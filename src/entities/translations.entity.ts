import { Lang } from "src/shares/enums/lang.enum";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ContentEntity } from "./content.entity";

@Entity('translations')
export class TranslationsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    field: string;

    @Column()
    model: string;

    @Column()
    modelId: number;

    @Column({ type: 'enum', enum: Lang, default: Lang.AZ })
    lang: Lang;

    @ManyToOne(() => ContentEntity, content => content.translations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'modelId' })
    content: ContentEntity;

    @Column()
    value: string;
}