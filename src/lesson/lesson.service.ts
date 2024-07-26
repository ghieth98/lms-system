import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto, UpdateLessonDto } from './dto';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}

  async create(createLessonDto: CreateLessonDto, moduleId: number) {
    //   query the module
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
    });
    //   check that the module exists
    if (!module)
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    //   create lesson
    const lesson = await this.prisma.lesson.create({
      data: {
        ...createLessonDto,
        moduleId,
      },
    });
    //   return new lesson with success message
    return {
      message: 'Lesson created successfully',
      lesson,
    };
  }

  async findAll(moduleId: number) {
    // return  all modules belonging to module
    const lessons = await this.prisma.lesson.findMany({
      where: { moduleId: moduleId },
    });
    if (lessons.length === 0) throw new NotFoundException(`lesson not found`);
    return lessons;
  }

  async findOne(id: number, moduleId: number) {
    //   return lesson belonging to module
    const lesson = await this.prisma.lesson.findFirst({
      where: { id: id, moduleId: moduleId },
    });
    if (!lesson) throw new NotFoundException(`lesson not found`);
    return lesson;
  }

  async update(id: number, updateLessonDto: UpdateLessonDto, moduleId: number) {
    // query lesson
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: id },
    });
    // check if the lesson belongs to the course
    if (!lesson || lesson.moduleId !== moduleId)
      throw new NotFoundException(`Could not find the lesson for this module`);
    //   return updated module with success message
    return this.prisma.lesson.update({
      where: { id: id, moduleId: moduleId },
      data: {
        ...updateLessonDto,
      },
    });
  }

  async remove(id: number, moduleId: number) {
    //   Query for the lesson using id
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: id },
    });
    //   Check that the lesson exists and that it belongs to the correct course
    if (!lesson || lesson.moduleId !== moduleId)
      throw new NotFoundException(`Could not find the lesson for this module`);
    //   delete the lesson
    await this.prisma.lesson.delete({
      where: { id: id, moduleId: moduleId },
    });
    //   return success message
    return {
      message: 'lesson removed successfully',
    };
  }
}
