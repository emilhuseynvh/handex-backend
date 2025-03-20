import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ContentEntity } from "./content.entity";
import { NewsEntity } from "./news.entity";
import { GeneralEntity } from "./general.entity";

@Entity('upload')
export class UploadEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @Column()
    path: string;

    @Column()
    mimetype: string;

    @OneToOne(() => NewsEntity, news => news.image)
    news: NewsEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => ContentEntity, content => content.images)
    content: ContentEntity;

    @ManyToOne(() => GeneralEntity, general => general.company)
    general: GeneralEntity;

}