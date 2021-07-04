import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword } from '../utils/cryptogram';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // JWT identity - Step 2: user identity
  async validateUser(email: string, password: string): Promise<any> {
    console.log('JWT identity - Step 2: user identity');
    console.log(email);
    const user = await this.usersService.findOne(email);
    console.log(user);
    const saltObj = await this.usersService.findOneSalt(user.u_id);
    if (user) {
      const hashedPassword = user.password;
      const salt = saltObj.salt;
      // generate new hashpassword by salt and user input, then compare with it in database
      const hashPassword = encryptPassword(password, salt);
      if (hashedPassword === hashPassword) {
        // password is right
        return {
          code: 1,
          user,
        };
      } else {
        // password is invalid
        return {
          code: 2,
          user: null,
        };
      }
    }
    // the user not exist
    return {
      code: 3,
      user: null,
    };
  }

  // JWT identity - Step 3: generate jwt token
  async certificate(user: any) {
    const payload = {
      email: user.email,
      sub: user.u_id,
    };
    console.log('JWT identity - Step 3: generate jwt token');
    try {
      const token = this.jwtService.sign(payload);
      return {
        code: 200,
        data: {
          token,
          user,
        },
        msg: `login successfully`,
      };
    } catch (error) {
      return {
        code: 600,
        msg: `email or password invalid`,
      };
    }
  }
}
