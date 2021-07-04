import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Task {
  @ApiProperty({
    required: false,
    description: 'Task ID',
  })
  @PrimaryGeneratedColumn()
  t_id: number;

  @ApiProperty({
    required: true,
    description: 'user id'
  })
  @Column()
  u_id: number;

  @ApiProperty({
    required: true,
    description: 'task name'
  })
  @Column()
  name: string;

  @ApiProperty({
    required: false,
    description: 'this task whether important'
  })
  @Column({ default: false })
  isImportant: boolean;

  @ApiProperty({
    required: true,
    description: 'task date'
  })
  @Column()
  date: Date;

  @ApiProperty({
    required: false,
    description: 'task status'
  })
  @Column({ default: false })
  isFinished: boolean;

  @ApiProperty({
    required: false,
  })
  @CreateDateColumn()
  created?: Date;

  @ApiProperty({
    required: false,
  })
  @UpdateDateColumn()
  updated?: Date;
}
