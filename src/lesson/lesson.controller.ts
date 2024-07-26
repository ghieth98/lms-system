import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto, UpdateLessonDto } from './dto';

@Controller('/module/:moduleId/lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  create(
    @Body() createLessonDto: CreateLessonDto,
    @Param('moduleId', ParseIntPipe) moduleId: number,
  ) {
    return this.lessonService.create(createLessonDto, moduleId);
  }

  @Get()
  findAll(@Param('moduleId', ParseIntPipe) moduleId: number) {
    return this.lessonService.findAll(moduleId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Param('moduleId', ParseIntPipe) moduleId: number,
  ) {
    return this.lessonService.findOne(+id, moduleId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @Param('moduleId', ParseIntPipe) moduleId: number,
  ) {
    return this.lessonService.update(+id, updateLessonDto, moduleId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Param('moduleId', ParseIntPipe) moduleId: number,
  ) {
    return this.lessonService.remove(+id, moduleId);
  }
}
