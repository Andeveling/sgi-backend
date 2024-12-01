import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TasksService } from '../services/tasks.service';
import { MoveTaskDto } from '../dto/move-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@Param('columnId') columnId: string) {
    return this.tasksService.findAll(columnId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Post('move')
  move(@Body() moveTaskDto: MoveTaskDto) {
    console.log("Move Task", moveTaskDto);
    return this.tasksService.moveTask(moveTaskDto);
  }

  @Get("board/:boardId")
  findAllTasksByBoard(@Param('boardId') boardId: string) {
    return this.tasksService.findAllTasksByBoard(boardId);
  }
}
