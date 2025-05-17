import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ContentEntity } from "./content.entity";
import { NewsEntity } from "./news.entity";
import { GeneralEntity } from "./general.entity";
import { CustomersEntity } from "./customers.entity";
import { ProfilesEntity } from "./profile.entity";
import { StudyAreaEntity } from "./studyArea.entity";
import { BlogsEntity } from "./blogs.entity";
import { ProjectEntity } from "./project.entity";
import { ServiceEntity } from "./service.entity";
import { AboutEntity } from "./about.entity";

@Entity('upload')
export class UploadEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column({ nullable: true })
    alt: string

    @OneToMany(() => NewsEntity, news => news.image)
    news: NewsEntity;

    @OneToMany(() => ServiceEntity, service => service.image)
    service: ServiceEntity;

    @OneToMany(() => NewsEntity, project => project.image)
    project: ProjectEntity;

    @ManyToOne(() => AboutEntity, about => about.images, { onDelete: 'CASCADE' })
    about: AboutEntity;

    @OneToMany(() => BlogsEntity, blogs => blogs.image)
    blogs: NewsEntity;

    @OneToOne(() => StudyAreaEntity, study => study.image)
    studyArea: StudyAreaEntity;

    @OneToOne(() => CustomersEntity, customers => customers.bank_logo)
    bank_logo: CustomersEntity;

    @OneToOne(() => ProfilesEntity, profile => profile.image)
    profile: ProfilesEntity;

    @OneToOne(() => CustomersEntity, customers => customers.customer_profile)
    customer_profile: CustomersEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => ContentEntity, content => content.images, { onDelete: 'CASCADE' })
    content: ContentEntity;

    @ManyToOne(() => GeneralEntity, general => general.company)
    general: GeneralEntity;

}