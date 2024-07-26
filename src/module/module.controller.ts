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
import { ModuleService } from './module.service';
import { CreateModuleDto, UpdateModuleDto } from './dto';

@Controller('/course/:courseId/module')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  create(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() createModuleDto: CreateModuleDto,
  ) {
    return this.moduleService.create(courseId, createModuleDto);
  }

  @Get()
  findAll(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.moduleService.findAll(courseId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.moduleService.findOne(+id, courseId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    return this.moduleService.update(+id, courseId, updateModuleDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.moduleService.remove(+id, courseId);
  }
}
