import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/service';
import { User } from '../../user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmailAndPassword(
      email,
      password,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: (user as any)._id?.toString() ?? user['id'],
      role: user.role,
      spaceId: user.spaceId,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
