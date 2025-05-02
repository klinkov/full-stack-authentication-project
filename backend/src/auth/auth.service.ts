import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { KeycloakService } from './keycloak.service';

@Injectable()
export class AuthService {
  constructor(
    private keycloakService: KeycloakService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const token = await this.keycloakService.login(email, password);
      const user = await this.userRepository.findOne({ where: { email } });
      return user;
    } catch (error) {
      return null;
    }
  }

  async login(email: string, password: string) {
    try {
      const token = await this.keycloakService.login(email, password);
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { sub: user.id, email: user.email };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          balance: user.balance,
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

      const payload = { sub: user.id, email: user.email };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          balance: user.balance,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Registration failed');
    }
  }

  async updateProfile(id: string, email: string, name: string) {
    try {
      await this.keycloakService.updateUser(id, { email, firstName: name });
      return { id, email, name };
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
      await this.keycloakService.login(user.email, currentPassword);

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
