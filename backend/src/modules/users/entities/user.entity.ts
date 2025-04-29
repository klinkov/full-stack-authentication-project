import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ type: 'decimal', default: 0.00 })
    balance: number;

    @Column()
    created_at: Date;

    @OneToMany(() => Transaction, (transaction) => transaction.user)
    transactions: Transaction[];
}