import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';

import { Task } from './tasks.entity';
import { taskDto } from './tasks.dto';
import { ProjectsService } from 'src/projects/projects.service';
import { UserService } from 'src/users/user.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    private ProjectService: ProjectsService,
    private UserService: UserService,
  ) { }

  async findAll() {
    return this.taskRepo.find({
      relations: ['project', 'user'],
    })
  }

  async findOne(id: number) {
    const task = await this.taskRepo.findOne({ where: { id }, relations: ['project, user'] });
    if (!task) {
      throw new NotFoundException(`task #${id} not found`);
    }
    return task;
  }

  async findByName(name: string) {
    return await this.taskRepo.findOne({ where: { name }, relations: ['project, user'] });
  }

  async create(payload: taskDto) {
    const newtask = this.taskRepo.create(payload);
    if (payload.projectId) {
      const project = await this.ProjectService.findOne(payload.projectId);
      newtask.project = project;
    }
    if (payload.userId) {
      const user = await this.UserService.findOne(payload.userId);
      newtask.user = user;
    }
    return await this.taskRepo.save(newtask).catch((error) => {
      throw new ConflictException(error.detail);
    });
  }

  async update(id: number, payload: taskDto) {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`task #${id} not found`);
    }
    if (payload.projectId) {
      const project = await this.ProjectService.findOne(payload.projectId);
      task.project = project;
    }
    if (payload.userId) {
      const user = await this.UserService.findOne(payload.userId);
      task.user = user;
    }
    this.taskRepo.merge(task, payload);
    return await this.taskRepo.save(task).catch((error) => {
      throw new ConflictException(error.detail);
    });
  }

  async delete(id: number) {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`task #${id} not found`);
    }
    this.taskRepo.delete({ id });
    return task;
  }
}
