import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { User } from '../users/entities/user.entity';
import { Transaction } from '../users/entities/transaction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Transaction])],
    providers: [PaymentsService],
    controllers: [PaymentsController],
})
export class PaymentsModule {}