import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModuleDto, UpdateModuleDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModuleService {
  constructor(private prisma: PrismaService) {}

  async create(courseId: number, createModuleDto: CreateModuleDto) {
    // Check if the course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    //   Create the module
    const module = await this.prisma.module.create({
      data: {
        courseId,
        ...createModuleDto,
      },
    });

    //   return success message
    return {
      module,
      message: 'Module created successfully',
    };
  }

  async findAll(courseId: number) {
    //   Find the course
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    //   Check if the course exists
    if (!course)
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    //   fetch all modules belonging to courses
    const modules = await this.prisma.module.findMany({
      where: { courseId: courseId },
    });
    if (modules.length === 0)
      throw new NotFoundException('Course does not have modules');
    return modules;
  }

  async findOne(id: number, courseId: number) {
    //   GEt the course id
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    //   Check that the course exists
    if (!course) throw new NotFoundException('Course with ID not found');
    //   Query the module
    const module = await this.prisma.module.findFirst({
      where: { id: id, courseId: courseId },
    });
    //   Check that the module exists
    if (!module)
      throw new NotFoundException('Could not found the module for this course');
    //   return the module with success message
    return module;
  }

  async update(id: number, courseId: number, updateModuleDto: UpdateModuleDto) {
    // query module
    const module = await this.prisma.module.findUnique({
      where: { id: id },
    });
    // check if the module belongs to the course
    if (!module || module.courseId !== courseId)
      throw new NotFoundException(`Could not find the module for this course`);
    //   update the module
    //   return updated module with success message
    return this.prisma.module.update({
      where: { id: id, courseId: courseId },
      data: {
        ...updateModuleDto,
      },
    });
  }

  async remove(id: number, courseId: number) {
    //   Query for the module using id
    const module = await this.prisma.module.findUnique({
      where: { id: id },
    });
    //   Check that the module exists and that it belongs to the correct course
    if (!module || module.courseId !== courseId)
      throw new NotFoundException(`Could not find the module for this course`);
    //   delete the module
    await this.prisma.module.delete({
      where: { id: id, courseId: courseId },
    });
    //   return success message
    return {
      message: 'Module removed successfully',
    };
  }
}
