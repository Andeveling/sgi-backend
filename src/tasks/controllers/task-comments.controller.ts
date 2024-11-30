import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { TaskCommentsService } from '../services/task-comments.service';
import { CreateTaskCommentDto } from '../dto/create-task-comment';
import { UpdateTaskCommentDto } from '../dto/update-task-comment';


@Controller('task-comments')
export class TaskCommentsController {
  constructor(private readonly taskCommentsService: TaskCommentsService) {}

  @Get()
  async findAll() {
    return this.taskCommentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.taskCommentsService.findOne(id);
  }

  @Post()
  async create(@Body() createTaskCommentDto: CreateTaskCommentDto) {
    return this.taskCommentsService.create(createTaskCommentDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskCommentDto: UpdateTaskCommentDto,
  ) {
    return this.taskCommentsService.update(id, updateTaskCommentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.taskCommentsService.remove(id);
  }
  
}
