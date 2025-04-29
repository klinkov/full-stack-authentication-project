import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.transactions)
    user: User;

    @Column({ type: 'decimal' })
    amount: number;

    @Column()
    type: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    created_at: Date;
}