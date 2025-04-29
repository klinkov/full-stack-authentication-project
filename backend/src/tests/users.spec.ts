import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../modules/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Transaction } from '../modules/users/entities/transaction.entity';
import { KeycloakService } from '../modules/users/keycloak.service';
import { Repository } from 'typeorm';

describe('UsersService', () => {
    let service: UsersService;
    let userRepository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Transaction),
                    useClass: Repository,
                },
                {
                    provide: KeycloakService,
                    useValue: {
                        updateUserEmail: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should sync new user', async () => {
        const user = {
            id: '1',
            email: 'test@example.com',
            balance: 0.00, // Added to match User entity
            created_at: new Date(),
            transactions: [], // Added to match User entity
        };
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
        jest.spyOn(userRepository, 'create').mockReturnValue(user);
        jest.spyOn(userRepository, 'save').mockResolvedValue(user);

        const result = await service.syncUser('1', 'test@example.com');
        expect(result).toEqual(user);
        expect(userRepository.create).toHaveBeenCalled();
        expect(userRepository.save).toHaveBeenCalled();
    });
});