// import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { GroupEntity } from "./group.entity";
// import { TranslationsEntity } from "./translations.entity";
// import { MetaEntity } from "./meta.entity";
// import { ContentEntity } from "./content.entity";

// @Entity('course')
// export class CoursesEntity {
//     @PrimaryGeneratedColumn()
//     id: number

//     @OneToMany(() => GroupEntity, group => group.course)
//     groups: GroupEntity[]

//     @OneToMany(() => TranslationsEntity, translation => translation.course)
//     translation: TranslationsEntity[]

//     @OneToMany(() => MetaEntity, meta => meta.course)
//     meta: MetaEntity[]

//     @OneToMany(() => ContentEntity, content => content.course)
//     content: ContentEntity[]

//     @CreateDateColumn({ type: 'timestamptz' })
//     createdAt: Date

// }