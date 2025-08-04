import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { KeycloakService } from './keycloak.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private keycloakService: KeycloakService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateUser(id: string, password: string): Promise<User | null> {
    try {
      const token = await this.keycloakService.login(id, password);
      const user = await this.userRepository.findOne({ where: { id } });
      return user;
    } catch (error) {
      return null;
    }
  }

  async login(email: string, password: string) {
    try {
      const token = await this.keycloakService.login(email, password);
      const user = await this.userRepository.findOne({ where: { id: email } });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          balance: user.balance,
          status: user.status,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    try {
      const keycloakUser = await this.keycloakService.createUser(
        email,
        password,
        firstName,
        lastName,
      );

      const user = await this.userRepository.findOne({
        where: { id: keycloakUser },
      });

      if (!user) {
        throw new Error('User not found after creation');
      }

      const payload = { sub: user.id };
      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        user: {
          id: user.id,
          balance: user.balance,
          status: user.status,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException({
        message: 'Registration failed',
        error: 'Unauthorized',
        statusCode: 401
      });
    }
  }

  async updateProfile(id: string, email: string, name: string) {
    try {
      await this.keycloakService.updateUser(id, { email, firstName: name });
      return { id };
    } catch {
      throw new UnauthorizedException('Profile update failed');
    }
  }

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Verify current password
      await this.keycloakService.login(id, currentPassword);

      // Update password
      await this.keycloakService.resetPassword(id, newPassword);

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw new UnauthorizedException('Password change failed');
    }
  }

  async requestPasswordReset(email: string) {
    try {
      const users = await this.keycloakService.findUserByEmail(email);
      if (!users || users.length === 0) {
        throw new UnauthorizedException('User not found');
      }

      const userId = users[0].id;
      if (!userId) {
        throw new UnauthorizedException('User ID not found');
      }

      await this.keycloakService.executeActionsEmail(userId, [
        'UPDATE_PASSWORD',
      ]);
    } catch {
      throw new UnauthorizedException('Password reset request failed');
    }
  }
}
