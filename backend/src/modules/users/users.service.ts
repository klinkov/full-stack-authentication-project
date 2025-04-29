import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { KeycloakService } from './keycloak.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Transaction)
        private transactionsRepository: Repository<Transaction>,
        private keycloakService: KeycloakService,
    ) {}

    async syncUser(id: string, email: string) {
        let user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            user = this.usersRepository.create({ id, email, created_at: new Date() });
            await this.usersRepository.save(user);
        }
        return user;
    }

    async updateEmail(id: string, email: string) {
        try {
            await this.keycloakService.updateUserEmail(id, email);
            await this.usersRepository.update(id, { email });
        } catch (error) {
            throw new HttpException(
                'Failed to update email',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async getUserProfile(id: string, roles: string[]) {
        if (!roles.includes('user')) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['transactions'],
        });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return user;
    }
}