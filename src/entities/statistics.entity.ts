import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('statistics')
export class StatisticsEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    certificates: number

    @Column()
    stutends: number

    @Column()
    graduates: number

    @Column()
    workers: number

    @Column()
    teachers: number
}