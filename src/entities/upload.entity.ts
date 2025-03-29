import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ContentEntity } from "./content.entity";
import { NewsEntity } from "./news.entity";
import { GeneralEntity } from "./general.entity";

@Entity('upload')
export class UploadEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @OneToOne(() => NewsEntity, news => news.image)
    news: NewsEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => ContentEntity, content => content.images, { onDelete: 'CASCADE' })
    content: ContentEntity;

    @ManyToOne(() => GeneralEntity, general => general.company)
    general: GeneralEntity;

}