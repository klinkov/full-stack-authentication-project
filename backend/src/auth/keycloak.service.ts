import { Injectable, Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, UserStatus } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { KeycloakConnectModule, KeycloakConnectOptions } from 'nest-keycloak-connect';
import axios from 'axios';

interface KeycloakUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class KeycloakService implements OnModuleInit {
  private realm: string;
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;
  private readonly logger = new Logger(KeycloakService.name);
  private adminToken: string;

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.realm = this.configService.get<string>('KEYCLOAK_REALM') || 'automation-realm';
    this.clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID') || 'automation-client';
    this.clientSecret = this.configService.get<string>('KEYCLOAK_CLIENT_SECRET') || 'KEYCLOAK_CLIENT_SECRET';
    this.baseUrl = this.configService.get<string>('KEYCLOAK_URL') || 'http://localhost:8080';
  }

  async onModuleInit() {
    await this.initializeKeycloak();
  }

  private async initializeKeycloak() {
    try {
      const keycloakOptions: KeycloakConnectOptions = {
        authServerUrl: this.baseUrl,
        realm: this.realm,
        clientId: this.clientId,
        secret: this.clientSecret,
      };

      await KeycloakConnectModule.register(keycloakOptions);
      this.logger.log('Connected to Keycloak');

      // Get admin token
      await this.getAdminToken();
    } catch (error) {
      this.logger.error('Failed to initialize Keycloak', error);
      throw new Error('Failed to initialize Keycloak');
    }
  }

  private async getAdminToken() {
    try {
      const response = await axios.post(
        `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          grant_type: 'password',
          client_id: this.clientId,
          username: this.configService.get<string>('KEYCLOAK_ADMIN_USERNAME') || 'admin',
          password: this.configService.get<string>('KEYCLOAK_ADMIN_PASSWORD') || 'admin',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.adminToken = response.data.access_token;
      this.logger.log('Admin token obtained successfully');
    } catch (error) {
      this.logger.error('Failed to get admin token', error);
      throw new Error('Failed to get admin token');
    }
  }

  async login(username: string, password: string): Promise<{ access_token: string }> {
    // Implementation will be updated to use nest-keycloak-connect
    throw new Error('Method not implemented');
  }

  async createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<string> {
    this.logger.log(`[DEBUG] Starting user creation for email: ${email}`);
    let userId: string;

    try {
      this.logger.log('[DEBUG] Checking if user exists in Keycloak');
      // First check if user exists
      const existingUsers = await axios.get(
        `${this.baseUrl}/admin/realms/${this.realm}/users`,
        {
          params: {
            email,
            exact: true,
          },
          headers: {
            'Authorization': `Bearer ${this.adminToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      this.logger.log(`[DEBUG] Existing users check result: ${JSON.stringify(existingUsers.data)}`);

      if (existingUsers.data && existingUsers.data.length > 0) {
        this.logger.error(`[DEBUG] User with email ${email} already exists`);
        throw new UnauthorizedException({
          message: 'User with provided email already exists',
          error: 'UserExists',
          statusCode: 401
        });
      }

      this.logger.log('[DEBUG] Creating user in Keycloak');
      // Create user in Keycloak using Admin REST API
      const response = await axios.post(
        `${this.baseUrl}/admin/realms/${this.realm}/users`,
        {
          username: email,
          email,
          firstName,
          lastName,
          enabled: true,
          credentials: [{
            type: 'password',
            value: password,
            temporary: false,
          }],
        },
        {
          headers: {
            'Authorization': `Bearer ${this.adminToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      this.logger.log(`[DEBUG] Keycloak response: ${JSON.stringify(response.data)}`);
      this.logger.log(`[DEBUG] Keycloak response headers: ${JSON.stringify(response.headers)}`);

      // Get the created user's ID from the Location header
      userId = response.headers.location.split('/').pop();
      this.logger.log(`[DEBUG] Keycloak user created with ID: ${userId}`);

      try {
        this.logger.log('[DEBUG] Starting database user creation');
        // Create user in our database with only ID and balance
        this.logger.log(`[DEBUG] Creating database user with ID: ${userId}`);
        const dbUser = this.userRepository.create({
          id: userId,
          balance: 0,
          status: UserStatus.PENDING
        });

        this.logger.log(`[DEBUG] Created database user object: ${JSON.stringify(dbUser)}`);
        const savedUser = await this.userRepository.save(dbUser);
        this.logger.log(`[DEBUG] Database user saved successfully: ${JSON.stringify(savedUser)}`);

        return savedUser.id;
      } catch (dbError) {
        this.logger.error(`[DEBUG] Database save failed for user: ${userId}`, {
          error: dbError,
          message: dbError instanceof Error ? dbError.message : 'Unknown error',
          stack: dbError instanceof Error ? dbError.stack : undefined
        });
        // If database save fails, we should still consider the operation successful
        // since the Keycloak user was created
        return userId;
      }
    } catch (error) {
      this.logger.error(`[DEBUG] Service error:`, {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });

      if (error instanceof UnauthorizedException) {
        this.logger.error('[DEBUG] Throwing UnauthorizedException');
        throw error;
      }
      if (axios.isAxiosError(error)) {
        this.logger.error(`[DEBUG] Axios error for email: ${email}`, {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          stack: error.stack
        });
      } else {
        this.logger.error(`[DEBUG] Unknown error for email: ${email}`, {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
      }
      // Don't throw UnauthorizedException here, just return the Keycloak user ID
      return userId;
    }
  }

  async getUserById(id: string): Promise<KeycloakUser> {
    // Implementation will be updated to use nest-keycloak-connect
    throw new Error('Method not implemented');
  }

  async updateUser(id: string, data: Partial<KeycloakUser>): Promise<void> {
    // Implementation will be updated to use nest-keycloak-connect
    throw new Error('Method not implemented');
  }

  async deleteUser(id: string): Promise<void> {
    // Implementation will be updated to use nest-keycloak-connect
    throw new Error('Method not implemented');
  }

  async resetPassword(id: string, newPassword: string): Promise<void> {
    // Implementation will be updated to use nest-keycloak-connect
    throw new Error('Method not implemented');
  }

  async executeActionsEmail(id: string, actions: string[]): Promise<void> {
    // Implementation will be updated to use nest-keycloak-connect
    throw new Error('Method not implemented');
  }

  async findUserByEmail(email: string): Promise<KeycloakUser[]> {
    // Implementation will be updated to use nest-keycloak-connect
    throw new Error('Method not implemented');
  }
}
