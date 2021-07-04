import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  @InjectRepository(Task)
  private taskRepository;

  async save(task: Task): Promise<Task> {
    return await this.taskRepository.save(task);
  }
  async update(task: Task, u_id: number): Promise<Task> {
    return await this.taskRepository.update({ t_id: task.t_id, u_id }, task);
  }
  async delete(t_id: number, u_id: number): Promise<Task> {
    try {
      return await this.taskRepository.delete({ t_id, u_id });
    } catch (e) {
      return e;
    }
  }
  async getAllTaskByUid(u_id: number): Promise<Task[]> {
    return await this.taskRepository.find({ where: { u_id } });
  }
  async getAllImportantTaskByUid(u_id: number): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { u_id, isImportant: true },
    });
  }
  async getTodayTaskByUid(u_id: number): Promise<Task[]> {
    return await this.taskRepository
      .createQueryBuilder('task')
      .where('to_days(date) = to_days(now()) and task.u_id = :u_id', { u_id })
      .getMany();
  }
  async getTasks(task: Task): Promise<Task[]> {
    return await this.taskRepository.find(task);
  }
}
