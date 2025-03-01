import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CoursesEntity } from "./course.entity";

@Entity('group')
export class GroupEntity{
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => CoursesEntity, course => course.groups)
    course: CoursesEntity

    @Column('date')
    startDate: Date

    @Column()
    daysOfWeek: string

    @CreateDateColumn({type: 'timestamptz'})
    createdAt: Date
}