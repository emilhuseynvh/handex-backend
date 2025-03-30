import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ContentEntity } from "./content.entity";
import { NewsEntity } from "./news.entity";
import { GeneralEntity } from "./general.entity";
import { CustomersEntity } from "./customers.entity";
import { ProfilesEntity } from "./profile.entity";

@Entity('upload')
export class UploadEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @OneToOne(() => NewsEntity, news => news.image)
    news: NewsEntity;

    @OneToOne(() => CustomersEntity, customers => customers.bank_logo)
    bank_logo: CustomersEntity

    @OneToOne(() => ProfilesEntity, profile => profile.image)
    profile: ProfilesEntity
    
    @OneToOne(() => CustomersEntity, customers => customers.customer_profile)
    customer_profile: CustomersEntity

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => ContentEntity, content => content.images, { onDelete: 'CASCADE' })
    content: ContentEntity;

    @ManyToOne(() => GeneralEntity, general => general.company)
    general: GeneralEntity;

}