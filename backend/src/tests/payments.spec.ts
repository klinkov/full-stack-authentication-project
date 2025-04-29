import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from '../modules/payments/payments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Transaction } from '../modules/users/entities/transaction.entity';
import { Repository } from 'typeorm';

describe('PaymentsService', () => {
    let service: PaymentsService;
    let userRepository: Repository<User>;
    let transactionRepository: Repository<Transaction>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentsService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Transaction),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<PaymentsService>(PaymentsService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        transactionRepository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should process payment successfully', async () => {
        const user = {
            id: '1',
            email: 'test@example.com',
            balance: 0.00,
            created_at: new Date(),
            transactions: [], // Added to match User entity
        };
        const transaction = {
            id: 't1',
            user, // References the updated user object
            amount: 100,
            type: 'CREDIT',
            description: 'Payment received',
            created_at: new Date(),
        };

        jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
        jest.spyOn(transactionRepository, 'create').mockReturnValue(transaction);
        jest.spyOn(transactionRepository, 'save').mockResolvedValue(transaction);
        jest.spyOn(userRepository, 'update').mockResolvedValue({ affected: 1 } as any);

        const result = await service.processPayment('1', 100);
        expect(result).toEqual({ message: 'Payment processed successfully' });
        expect(transactionRepository.create).toHaveBeenCalled();
        expect(transactionRepository.save).toHaveBeenCalled();
        expect(userRepository.update).toHaveBeenCalledWith('1', { balance: expect.any(Function) });
    });
});