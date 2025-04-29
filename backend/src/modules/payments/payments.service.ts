import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Transaction } from '../users/entities/transaction.entity';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Transaction)
        private transactionsRepository: Repository<Transaction>,
    ) {}

    async processPayment(userId: string, amount: number) {
        if (amount <= 0) {
            throw new HttpException(
                'Invalid payment amount',
                HttpStatus.BAD_REQUEST,
            );
        }

        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const transaction = this.transactionsRepository.create({
            user,
            amount,
            type: 'CREDIT',
            description: 'Payment received',
            created_at: new Date(),
        });

        await this.transactionsRepository.save(transaction);
        await this.usersRepository.update(userId, {
            balance: () => `balance + ${amount}`,
        });

        return { message: 'Payment processed successfully' };
    }
}