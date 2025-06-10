import { Lang } from "src/shares/enums/lang.enum";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ContentEntity } from "./content.entity";
import { MetaEntity } from "./meta.entity";
import { NewsEntity } from "./news.entity";
import { CustomersEntity } from "./customers.entity";
import { StudyAreaEntity } from "./studyArea.entity";
import { ProgramEntity } from "./programs.entity";
import { BlogsEntity } from "./blogs.entity";
import { ProjectEntity } from "./project.entity";
import { ServiceEntity } from "./service.entity";
import { FaqEntity } from "./faq.entity";
import { SideEntity } from "./side.entity";
import { GroupEntity } from "./group.entity";
import { ProfilesEntity } from "./profile.entity";
import { StatisticEntity } from "./statistic.entity";

@Entity('translations')
export class TranslationsEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    field: string;

    @Column()
    model: string;

    @Column({ type: 'enum', enum: Lang, default: Lang.AZ })
    lang: Lang;

    @Column({ nullable: true })
    value: string;

    @ManyToOne(() => ContentEntity, content => content.translations, { onDelete: 'CASCADE' })
    content: ContentEntity;

    @ManyToOne(() => ProfilesEntity, profile => profile.translations, { onDelete: 'CASCADE' })
    profile: ContentEntity;

    @ManyToOne(() => StatisticEntity, statistic => statistic.translations, { onDelete: 'CASCADE' })
    statistic: ContentEntity;

    @ManyToOne(() => SideEntity, side => side.translations, { onDelete: 'CASCADE' })
    side: SideEntity;

    @ManyToOne(() => ProgramEntity, program => program.translations, { onDelete: 'CASCADE' })
    program: ContentEntity;

    @ManyToOne(() => StudyAreaEntity, study => study.translations, { onDelete: 'CASCADE' })
    studyArea: StudyAreaEntity;

    @ManyToOne(() => FaqEntity, faq => faq.translations, { onDelete: 'CASCADE' })
    faq: FaqEntity;

    @ManyToOne(() => CustomersEntity, customer => customer.translations, { onDelete: 'CASCADE' })
    customers: CustomersEntity;

    @ManyToOne(() => NewsEntity, news => news.translations, { onDelete: 'CASCADE' })
    news: NewsEntity;

    @ManyToOne(() => ServiceEntity, service => service.translations, { onDelete: 'CASCADE' })
    service: ServiceEntity;

    @ManyToOne(() => ProjectEntity, project => project.translations, { onDelete: 'CASCADE' })
    project: ProjectEntity;

    @ManyToOne(() => BlogsEntity, blogs => blogs.translations, { onDelete: 'CASCADE' })
    blogs: BlogsEntity;

    @ManyToOne(() => MetaEntity, meta => meta.translations, { onDelete: 'CASCADE' })
    meta: MetaEntity;

    @ManyToOne(() => GroupEntity, group => group.table, { onDelete: 'CASCADE' })
    groups: GroupEntity;

    @ManyToOne(() => GroupEntity, group => group.text, { onDelete: 'CASCADE' })
    text: GroupEntity;
}