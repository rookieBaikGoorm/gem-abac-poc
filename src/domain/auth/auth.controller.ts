import { Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from '../../shared/decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }
}
