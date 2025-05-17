import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { SideEntity } from './side.entity';
import { AboutEntity } from './about.entity';

@Entity()
export class SectionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => SideEntity, { cascade: true, eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'leftSideId', referencedColumnName: 'id' })
    left_side: SideEntity;

    @ManyToOne(() => AboutEntity, about => about.sections, { onDelete: 'CASCADE' })
    about: AboutEntity;

    @OneToOne(() => SideEntity, { cascade: true, eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'rightSideId', referencedColumnName: 'id' })
    right_side: SideEntity;
}
