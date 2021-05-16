import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';

import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task-dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    const tasks = [...this.tasks];
    return tasks;
  }
  getTasksWithFilter(filterDto): Task[] {
    let tasks = this.getAllTasks();
    const { status, search } = filterDto;
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
    return tasks;
  }
  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }
  getTaskById(id: string): Task {
    const task: Task = this.tasks.find((task) => task.id == id);
    if (!task) {
      throw new NotFoundException('Task Not Found');
    }
    return task;
  }
  deleteTaskById(id: string) {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }
  updateTaskStatusById(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);
    task.status = status;
  }
}
