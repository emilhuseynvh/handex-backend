import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UploadEntity } from "./upload.entity";
import { TranslationsEntity } from "./translations.entity";
import { MetaEntity } from "./meta.entity";

@Entity('service')
export class ServiceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UploadEntity, upload => upload.service)
    image: UploadEntity;

    @Column({ unique: true })
    slug: string;

    @OneToMany(() => TranslationsEntity, translations => translations.service, { cascade: true })
    translations: TranslationsEntity[];

    @OneToMany(() => MetaEntity, meta => meta.service, { cascade: true })
    meta: MetaEntity[];

    @CreateDateColumn()
    createdAt: Date;
}