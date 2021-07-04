import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from '../users/user.decorator';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
  ) {}

  /***
   * Save task
   * @param task
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('save')
  @ApiBody({
    description: 'task information',
    type: Task,
  })
  @ApiResponse({ status: 201, type: Task, description: 'successful' })
  async save(@Body() task: Task): Promise<Task> {
    return this.taskService.save(task);
  }

  /***
   * Update task
   * @param task
   * @param u_id
   */
  @UseGuards(AuthGuard('jwt'))
  @Put('update')
  @ApiBody({
    description: 'task information',
    type: Task,
  })
  @ApiResponse({ status: 201, type: Task, description: 'successful' })
  async update(
    @Body() task: Task,
    @AuthUser('u_id') u_id: number,
  ): Promise<Task> {
    return this.taskService.update(task, u_id);
  }

  /***
   * Delete task
   * @param t_id
   * @param u_id
   */
  @UseGuards(AuthGuard('jwt'))
  @Delete('delete')
  @ApiQuery({
    name: 't_id',
    description: 'task information delete',
  })
  @ApiResponse({
    status: 200,
    description: 'successfully delete task',
  })
  async delete(
    @Query('t_id') t_id: string,
    @AuthUser('u_id') u_id: number,
  ): Promise<Task> {
    return this.taskService.delete(parseInt(t_id), u_id);
  }

  /***
   * return all tasks belong to this user
   * @param u_id
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('getAllTaskByUid')
  @ApiQuery({
    name: 'u_id',
    description: 'user id',
  })
  @ApiResponse({
    status: 200,
    description: 'return all tasks belong to this user',
  })
  async getAllTaskByUid(@Query('u_id') u_id: string): Promise<Task[]> {
    return this.taskService.getAllTaskByUid(parseInt(u_id));
  }

  /***
   * Return all important tasks belong to this user
   * @param u_id
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('getAllImportantTaskByUid')
  @ApiQuery({
    name: 'u_id',
    description: 'user id',
  })
  @ApiResponse({
    status: 200,
    description: 'return all important tasks belong to this user',
  })
  async getAllImportantTaskByUid(@Query('u_id') u_id: string): Promise<Task[]> {
    return this.taskService.getAllImportantTaskByUid(parseInt(u_id));
  }

  /***
   * Return all today's tasks belong to this user
   * @param u_id
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('getTodayTaskByUid')
  @ApiQuery({
    name: 'u_id',
    description: 'user id',
  })
  @ApiResponse({
    status: 200,
    description: "return all today's tasks belong to this user",
  })
  async getTodayTaskByUid(@Query('u_id') u_id: string): Promise<Task[]> {
    return this.taskService.getTodayTaskByUid(parseInt(u_id));
  }
  /***
   * Return all today's tasks belong to this user by specific condition
   * @param u_id
   * @param task
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('getTasks')
  @ApiQuery({
    name: 'task',
    description: 'task condition',
  })
  @ApiResponse({
    status: 200,
    description:
      "return all today's tasks belong to this user by specific condition",
  })
  async getTasks(
    @Query() task: Task,
    @AuthUser('u_id') u_id: number,
  ): Promise<Task[]> {
    task.u_id = u_id;
    return this.taskService.getTasks(task);
  }
}
