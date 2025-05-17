import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UploadEntity } from "./upload.entity";
import { TranslationsEntity } from "./translations.entity";
import { MetaEntity } from "./meta.entity";

@Entity('news')
export class NewsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UploadEntity, upload => upload.news)
    image: UploadEntity;

    @Column({ unique: true })
    slug: string;

    @OneToMany(() => TranslationsEntity, translations => translations.news, { cascade: true })
    translations: TranslationsEntity[];

    @OneToMany(() => MetaEntity, meta => meta.news, { cascade: true })
    meta: MetaEntity[];

    @CreateDateColumn()
    createdAt: Date;
}