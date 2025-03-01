import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TranslationsEntity } from "./translations.entity";
import { UploadEntity } from "./upload.entity";
import { MetaEntity } from "./meta.entity";
import { CoursesEntity } from "./course.entity";

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

    @OneToMany(() => MetaEntity, meta => meta.content, { cascade: true })
    meta: MetaEntity[];

    // @ManyToOne(() => UploadEntity, upload => upload.content)
    // images: UploadEntity[];

    @ManyToOne(() => CoursesEntity, course => course.content)
    course: CoursesEntity;

    @OneToMany(() => TranslationsEntity, tranlation => tranlation.content)
    translations: TranslationsEntity[];
    content: MetaEntity;

}