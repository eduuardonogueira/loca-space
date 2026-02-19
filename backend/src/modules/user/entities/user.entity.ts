import { EnumUserRole, EnumUserType } from 'src/types/user';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { Room } from '../../room/entities/room.entity';
import { Favorite } from '../../favorite/entities/favorite.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Address } from 'src/modules/address/entities/address.entity';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: EnumUserType, default: EnumUserType.EXTERNO })
  type: EnumUserType;

  @Column({ type: 'enum', enum: EnumUserRole, default: EnumUserRole.USER })
  role: EnumUserRole;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => Room, (room) => room.user)
  rooms: Room[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];

  @OneToOne(() => Address, (address) => address.room, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  address: Address;
}
