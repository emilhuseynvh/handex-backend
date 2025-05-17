import { Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SectionEntity } from './section.entity';
import { UploadEntity } from './upload.entity';

@Entity('about')
export class AboutEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => UploadEntity, upload => upload.about, { eager: true })
    images: UploadEntity[];

    @OneToMany(() => SectionEntity, section => section.about, { cascade: true, eager: true })
    sections: SectionEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
