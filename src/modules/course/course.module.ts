import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesEntity } from 'src/entities/course.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CoursesEntity])],
    controllers: [CourseController],
    providers: [CourseService],
})
export class CourseModule { };