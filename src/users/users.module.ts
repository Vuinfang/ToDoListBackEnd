import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Salt } from './salt.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Salt]),
  ],
  providers: [UsersService],
  exports: [UsersService],
  // controllers: [UsersController],

  // providers: [{
  //   provide: 'usersService',
  //   useClass: UsersService,
  // }],
})
export class UsersModule {}
