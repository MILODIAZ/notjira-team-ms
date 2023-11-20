import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';

import { Task } from './tasks.entity';
import { taskDto, updateTaskDto, FilterTasksDto } from './tasks.dto';
import { ProjectsService } from 'src/projects/projects.service';
import { UserService } from 'src/users/user.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    private ProjectService: ProjectsService,
    private UserService: UserService,
  ) { }

  async findAll(params?: FilterTasksDto) {
    if (params) {
      const where: FindOptionsWhere<Task> = {};
      const { filterName, filterResponsable, filterStatus } = params;
      if (filterName) {
        where.name = ILike(`%${filterName}%`);
      }
      if (filterStatus) {
        where.status = filterStatus;
      }
      if (filterResponsable) {
        where.responsable = {
          userName: filterResponsable,
        };
      }
      return this.taskRepo.find({
        relations: ['project', 'responsable', 'creator'],
        where,
      });
    }
    return this.taskRepo.find({
      relations: ['project', 'responsable', 'creator'],
    })
  }

  async findOne(id: number) {
    const task = await this.taskRepo.findOne({ where: { id }, relations: ['project', 'responsable', 'creator'] });
    if (!task) {
      throw new NotFoundException(`task #${id} not found`);
    }
    return task;
  }

  async findByName(name: string) {
    return await this.taskRepo.findOne({ where: { name }, relations: ['project', 'responsable', 'creator'] });
  }

  async create(payload: taskDto) {
    const newtask = this.taskRepo.create(payload);
    if (payload.projectId) {
      const project = await this.ProjectService.findOne(payload.projectId);
      newtask.project = project;
    }
    if (payload.creatorUser) {
      const user = await this.UserService.findByUserName(payload.creatorUser);
      newtask.responsable = user;
    }
    if (payload.responsableUser) {
      const user = await this.UserService.findByUserName(payload.responsableUser);
      newtask.responsable = user;
    }
    return await this.taskRepo.save(newtask).catch((error) => {
      throw new ConflictException(error.detail);
    });
  }

  async update(id: number, payload: updateTaskDto) {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`task #${id} not found`);
    }
    if (payload.responsableUser) {
      const user = await this.UserService.findByUserName(payload.responsableUser);
      task.responsable = user;
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
    task.deleted = true;
    return await this.taskRepo.save(task);
  }
}
