import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCourseDto, UpdateCourseDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = await this.prisma.course.create({
      data: {
        ...createCourseDto,
      },
    });
    return {
      course,
      message: 'This course has been created',
    };
  }

  findAll() {
    return this.prisma.course.findMany({});
  }

  findOne(id: number) {
    return this.prisma.course.findFirst({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    //   Get the course by id
    const course = await this.prisma.course.findUnique({
      where: {
        id: id,
      },
    });

    //  Check the course id
    if (!course) throw new ForbiddenException('Course does not exist');
    //   update the course
    await this.prisma.course.update({
      where: {
        id: id,
      },
      data: {
        ...updateCourseDto,
      },
    });
    //   return success message
    return {
      message: 'Course updated successfully',
    };
  }

  async remove(id: number) {
    //   Get the course by id
    const course = await this.prisma.course.findUnique({
      where: {
        id: id,
      },
    });
    //   Check that the course exists
    if (!course) throw new ForbiddenException('Course does not exist');
    //   delete the course
    await this.prisma.course.delete({
      where: {
        id: id,
      },
    });
    //   return success message
    return {
      message: 'Course removed successfully',
    };
  }
}
