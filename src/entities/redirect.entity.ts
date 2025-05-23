import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('redirect')
export class RedirectEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    isPermanent: boolean

    @Column()
    from: string;

    @Column()
    to: string;
}