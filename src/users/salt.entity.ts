import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Entity()
export class Salt {
  @IsNumber()
  @PrimaryGeneratedColumn()
  s_id: number;

  @IsNotEmpty({ message: 'u_id cannot be empty' })
  @Column({ unique: true })
  u_id: number;

  @Column()
  salt: string;
}
