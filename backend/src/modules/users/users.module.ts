import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { KeycloakService } from './keycloak.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Transaction])],
    providers: [UsersService, KeycloakService],
    controllers: [UsersController],
})
export class UsersModule {}