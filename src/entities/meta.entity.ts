import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ContentEntity } from "./content.entity";
import { TranslationsEntity } from "./translations.entity";

@Entity('meta')
export class MetaEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ContentEntity, content => content.meta, { onDelete: 'CASCADE' })
    content: ContentEntity;

    @OneToMany(() => TranslationsEntity, translation => translation.meta, { eager: true })
    translations: TranslationsEntity[];
}