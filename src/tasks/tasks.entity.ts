import {
    PrimaryGeneratedColumn,
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';

import { User } from 'src/users/user.entity';
import { Project } from 'src/projects/projects.entity';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true, length: 255 })
    name: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updateAt: Date;

    @ManyToOne(() => Project, (project) => project.tasks, {
        nullable: false, onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    project: Project;

    @ManyToOne(() => User, (user) => user.tasks, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    user: User;
}