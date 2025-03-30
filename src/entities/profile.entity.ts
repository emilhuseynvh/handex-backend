import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UploadEntity } from "./upload.entity";

@Entity('profiles')
export class ProfilesEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    speciality: string;

    @Column()
    model: string;

    @OneToOne(() => UploadEntity, upload => upload.profile)
    @JoinColumn()
    image: UploadEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}