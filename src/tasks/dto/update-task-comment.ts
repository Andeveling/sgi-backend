import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskCommentDto } from './create-task-comment';

export class UpdateTaskCommentDto extends PartialType(CreateTaskCommentDto) {}
