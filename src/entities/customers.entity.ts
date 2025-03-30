import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UploadEntity } from "./upload.entity";
import { TranslationsEntity } from "./translations.entity";

@Entity('customers')
export class CustomersEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    bank_name: string;

    @Column()
    name: string;

    @OneToOne(() => UploadEntity, upload => upload.bank_logo)
    @JoinColumn()
    bank_logo: UploadEntity;

    @OneToOne(() => UploadEntity, upload => upload.customer_profile)
    @JoinColumn()
    customer_profile: UploadEntity;

    @OneToMany(() => TranslationsEntity, translation => translation.customers, { cascade: true })
    translations: TranslationsEntity[];
}