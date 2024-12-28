import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from 'src/configs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { id: user.id, username: user.username };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  // สร้าง Access Token
  generateAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
  }

  // สร้าง Refresh Token
  async generateRefreshToken(user: User): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { id: user.id },
      { secret: JWT_REFRESH_SECRET, expiresIn: '1h' },
    );
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(user.id, user);
    return refreshToken;
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: JWT_REFRESH_SECRET,
      });
      const user = await this.userRepository.findOne({
        where: { id: decoded.id },
      });

      if (!user || !(await bcrypt.compare(refreshToken, user.refreshToken))) {
        throw new UnauthorizedException('Invalid token');
      }

      // สร้าง Access Token ใหม่
      const newAccessToken = this.generateAccessToken({
        id: user.id,
        username: user.username,
      });
      // สร้าง Refresh Token ใหม่
      const newRefreshToken = await this.generateRefreshToken(user);
      return { newAccessToken, newRefreshToken };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
