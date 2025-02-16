import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TranslationsEntity } from "./translations.entity";
import { UploadEntity } from "./upload.entity";

@Entity('content')
export class ContentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    slug: string;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => TranslationsEntity, tranlation => tranlation.content)
    translations: TranslationsEntity[];

}