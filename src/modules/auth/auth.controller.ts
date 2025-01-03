import {
  BadRequestException,
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
  async login(
    @Body() { username, password }: { username: string; password: string },
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      username,
      password,
    );
    res.cookie('access_token', accessToken, { httpOnly: true, secure: true });
    res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: true });
    return res.json({ message: 'Logged in successfully!' });
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    if (!req.cookies?.jwt_token) {
      throw new UnauthorizedException('Invalid credentials');
    }
    res.clearCookie('access_token', { httpOnly: true, secure: true });
    res.clearCookie('refresh_token', { httpOnly: true, secure: true });
    return res.json({
      message: 'You have logged out!',
    });
  }

  @Post('refresh')
  async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    try {
      const { newAccessToken, newRefreshToken } =
        await this.authService.refreshAccessToken(refreshToken);
      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: true,
      });
      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: true,
      });
      return res.json({ message: 'Refresh Token successfully' });
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to refresh token');
    }
  }
}
