import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@Entity()
export class User {
  @ApiProperty({
    required: false,
    description: 'User ID',
  })
  @IsNumber()
  @PrimaryGeneratedColumn()
  u_id: number;

  @ApiProperty({
    description: 'Email',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'email cannot be empty' })
  @IsString({ message: 'the value must be a string' })
  @Column({ comment: 'Email', length: 130, unique: true })
  email: string;

  @IsNotEmpty({ message: 'password cannot be empty' })
  @ApiProperty({
    description: 'Password',
  })
  @Column()
  password: string;

  // @ApiProperty({
  //   required: false,
  //   description: 'Mobile Phone',
  // })
  // @Column({ comment: 'Mobile', length: 30, unique: true })
  // mobile: string;

  @ApiProperty({
    required: false,
    description: 'Avatar',
  })
  @Column({ default: null })
  avatar: string;

  // @ApiProperty({
  //   required: false,
  //   description: 'FullName',
  // })
  // @Column({ comment: 'fullName', length: 130, default: null })
  // fullName: string;

  // @Column({ default: null })
  // salt: string;
  // @Column({ default: false })
  // is_deleted: boolean;

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
  //-------------------------------------------
  @ApiProperty({
    required: true,
    description: 'username',
  })
  @Column({ comment: 'username', length: 130, unique: false })
  @IsNotEmpty({ message: 'username cannot be empty' })
  username: string;
}

export class LoginDTO {
  @ApiProperty({ description: 'Email', example: 'user1@gmail.com' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  readonly email: string;
  @ApiProperty({ description: 'Password', example: 'Aa123456' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  readonly password: string;
}

export class userResponseDTO {
  @ApiProperty()
  readonly user: User;
  @ApiProperty({ description: 'JWT token' })
  readonly token: string;
}
