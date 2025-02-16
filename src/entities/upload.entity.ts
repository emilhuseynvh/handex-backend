import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ContentEntity } from "./content.entity";

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}