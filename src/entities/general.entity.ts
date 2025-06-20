import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UploadEntity } from "./upload.entity";

@Entity('general')
export class GeneralEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('json', { nullable: true })
    phone: string[];

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    email: string;

    @OneToMany(() => UploadEntity, upload => upload.general, { nullable: true, cascade: true })
    company: UploadEntity[];

}