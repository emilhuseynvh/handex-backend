import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('contact')
export class ContactEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    full_name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    title: string;

    @Column()
    message: string;

    @CreateDateColumn()
    createdAt: Date;
}