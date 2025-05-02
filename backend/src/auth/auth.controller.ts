import {
  Controller,
  Post,
  Body,
  Put,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RequestWithUser } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      return await this.authService.login(body.email, body.password);
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    },
  ) {
    try {
      return await this.authService.register(
        body.email,
        body.password,
        body.firstName,
        body.lastName,
      );
    } catch {
      throw new UnauthorizedException('Registration failed');
    }
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body('email') email: string,
    @Body('name') name: string,
  ) {
    return this.authService.updateProfile(req.user.id, email, name);
  }

  @Post('change-password')
  async changePassword(
    @Body()
    body: {
      id: string;
      currentPassword: string;
      newPassword: string;
    },
  ) {
    try {
      return await this.authService.changePassword(
        body.id,
        body.currentPassword,
        body.newPassword,
      );
    } catch {
      throw new UnauthorizedException('Password change failed');
    }
  }

  @Post('reset-password')
  async requestPasswordReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }
}
