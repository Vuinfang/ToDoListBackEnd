import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, In, Like, Not } from 'typeorm';
import { User } from './user.entity';
import { encryptPassword, makeSalt } from '../utils/cryptogram';
import { Salt } from './salt.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  // constructor(
  //   @InjectRepository(User)
  //   private usersRepository: Repository<User>,
  //   private saltRepository: Repository<Salt>,
  // ) {}
  @InjectRepository(User)
  private usersRepository;
  @InjectRepository(Salt)
  private saltRepository;
  constructor(
    private readonly mailerService: MailerService,
    private connection: Connection,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findAllUsers(
    keyword: string,
    page: number,
    amount: number,
  ): Promise<User[]> {
    // console.log(page);
    page = (page - 1) * amount;
    if (keyword) {
      keyword = '%' + keyword + '%';
    } else {
      keyword = '%';
    }
    // console.log(keyword);
    return this.usersRepository.find({
      where: {
        username: Like(keyword),
        is_deleted: 0,
      },
      skip: page,
      take: amount,
    });
  }

  async countAllUsers(keyword: string): Promise<any> {
    if (keyword) {
      keyword = '%' + keyword + '%';
    } else {
      keyword = '%';
    }
    return await this.usersRepository.count({
      where: {
        username: Like(keyword),
        is_deleted: false,
      },
    });
  }

  // async countGenderNumber(): Promise<any> {
  //   const male = await this.usersRepository.count({
  //     where: {
  //       gender: 0,
  //       is_deleted: false,
  //     },
  //   });
  //   const female = await this.usersRepository.count({
  //     where: {
  //       gender: 1,
  //       is_deleted: false,
  //     },
  //   });
  //   const other = await this.usersRepository.count({
  //     where: {
  //       gender: 2,
  //       is_deleted: false,
  //     },
  //   });
  //   return {
  //     male,
  //     female,
  //     other,
  //   };
  // }

  findOne(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }
  async findOneByUid(u_id: number): Promise<any> {
    return await this.usersRepository.findOne({ where: { u_id } });
  }
  findOneByUsername(username: string): Promise<User[]> {
    return this.usersRepository.find({ where: { username } });
  }

  findOneSalt(u_id: number): Promise<Salt> {
    return this.saltRepository.findOne({ where: { u_id } });
  }
  async update(user: User, u_id: string): Promise<any> {
    if (user.password) {
      const salt = makeSalt();
      user.password = encryptPassword(user.password, salt);
      // user.salt = salt;
      try {
        await this.connection.transaction(async (manager) => {
          await manager.update(User, u_id, user);
          await manager.update(Salt, u_id, { salt: salt });
        });
        return {
          code: 200,
          msg: 'Success',
        };
      } catch (error) {
        return {
          code: 503,
          msg: `Service error: ${error}`,
        };
      }
    } else {
      const res = await this.usersRepository.update(
        { u_id },
        user,
      );
      if (res.affected === 1) {
        return {
          code: 200,
          msg: 'Success',
        };
      } else {
        return {
          code: 403,
          msg: 'failed',
        };
      }
    }
  }

  async remove(u_id: number): Promise<void> {
    await this.usersRepository.delete(u_id);
  }

  /**
   * register
   * @param user
   */
  async register(user: User): Promise<any> {
    const result = await this.usersRepository.find({
      where: { email: user.email },
    });
    if (result.length > 0) {
      return {
        code: 400,
        msg: 'User already exist',
      };
    }
    const salt = makeSalt();
    user.password = encryptPassword(user.password, salt);
    try {
      try {
        await this.connection.transaction(async (manager) => {
          const res = await manager.save(User, user);
          await manager.insert(Salt, {
            u_id: res.u_id,
            salt: salt,
          });
        });
        return {
          code: 200,
          msg: 'Success',
        };
      } catch (error) {
        return {
          code: 503,
          msg: `Service error: ${error}`,
        };
      }
      // const userRes = await this.usersRepository.save(user);
      // // console.log(userRes);
      // await this.saltRepository.save({ u_id: userRes.u_id, salt: salt });
      // return {
      //   code: 200,
      //   msg: 'Success',
      // };
    } catch (error) {
      return {
        code: 503,
        msg: `Service error: ${error}`,
      };
    }
  }

  /***
   * email
   */
  public mailer(): void {
    this.mailerService
      .sendMail({
        to: 'email', // list of receivers
        from: 'email', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'Hi, nodemailer is working', // plaintext body
        html: '<b>welcome, this is todolist</b>', // HTML body content
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
