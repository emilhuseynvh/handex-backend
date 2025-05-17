import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UploadEntity } from "./upload.entity";
import { TranslationsEntity } from "./translations.entity";
import { MetaEntity } from "./meta.entity";

@Entity('blogs')
export class BlogsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UploadEntity, upload => upload.blogs)
    image: UploadEntity;

    @OneToMany(() => TranslationsEntity, translations => translations.blogs, { cascade: true })
    translations: TranslationsEntity[];

    @Column()
    slug: string;

    @OneToMany(() => MetaEntity, meta => meta.blogs, { cascade: true })
    meta: MetaEntity[];

    @CreateDateColumn()
    createdAt: Date;
}