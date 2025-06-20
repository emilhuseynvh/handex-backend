import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TranslationsEntity } from "./translations.entity";
import { UploadEntity } from "./upload.entity";
import { MetaEntity } from "./meta.entity";

@Entity('content')
export class ContentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slug: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => UploadEntity, upload => upload.content, { cascade: true })
    @JoinTable()
    images: UploadEntity[];

    @OneToMany(() => TranslationsEntity, tranlation => tranlation.content)
    translations: TranslationsEntity[];
}