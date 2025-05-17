import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UploadEntity } from "./upload.entity";
import { TranslationsEntity } from "./translations.entity";
import { MetaEntity } from "./meta.entity";

@Entity('project')
export class ProjectEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UploadEntity, upload => upload.project)
    image: UploadEntity;

    @Column({ unique: true })
    slug: string;

    @OneToMany(() => TranslationsEntity, translations => translations.project, { cascade: true })
    translations: TranslationsEntity[];

    @OneToMany(() => MetaEntity, meta => meta.project, { cascade: true })
    meta: MetaEntity[];

    @CreateDateColumn()
    createdAt: Date;
}