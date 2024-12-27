import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body() { username, password }: { username: string; password: string },
  ) {
    return this.authService.register(username, password);
  }

  @Post('login')
  login(
    @Body() { username, password }: { username: string; password: string },
    @Res() res: Response,
  ) {
    const accessToken = this.authService.login(username, password);
    res.cookie('jwt_token', accessToken, { httpOnly: true, secure: true });
    return res.json({ message: 'Logged in successfully!' });
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    if (!req.cookies?.jwt_token) {
      throw new UnauthorizedException('Invalid credentials');
    }
    res.clearCookie('jwt_token', { httpOnly: true, secure: true });
    return res.json({
      message: 'You have logged out!',
    });
  }
}
