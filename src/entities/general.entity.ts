import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UploadEntity } from "./upload.entity";

@Entity('general')
export class GeneralEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', { array: true })
    @Column('jsonb', { nullable: true })
    phone: string[];

    @Column('jsonb', { nullable: true })
    statistics: {
        certificates: number,
        students: number,
        teachers: number,
        workers: number;
    };

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    email: string;

    @OneToMany(() => UploadEntity, upload => upload.general, { eager: true, nullable: true, cascade: true })
    company: UploadEntity[];

}