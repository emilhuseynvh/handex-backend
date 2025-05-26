import { SideEnum } from 'src/shares/enums/side.enum';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { TranslationsEntity } from './translations.entity';
import { SectionEntity } from './section.entity';

@Entity('side')
export class SideEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: SideEnum, nullable: true })
    type: SideEnum;

    @OneToMany(() => TranslationsEntity, translations => translations.side, { cascade: true, eager: true })
    translations: TranslationsEntity[];

    @Column({ nullable: true })
    url: string;
}
