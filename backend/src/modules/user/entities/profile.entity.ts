import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity'

@Entity('Profile')
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true})
    avatarUrl: string;

    @Column()
    zipCode: string: 

    @Column()
    street: string;

    @Column({ nullable: true })
    complement: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @OneToOne(() => User, (user) => user.profile, { oneDelete: 'CASCADE'})
    @JoinColumn()
    user: User;
}