import { Controller, Get } from '@nestjs/common';

@Controller('course')
export class CourseController {
    constructor() { }

    @Get()
    list() { }
}