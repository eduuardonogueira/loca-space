import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Room } from '../../room/entities/room.entity';

@Entity('Address')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  street: string;

  @Column({nullable: true})
  number: string;

  @Column({ nullable: true })
  complement: string;

  @Column()
  bairro: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @OneToOne(() => Room, (room) => room.address)
  room: Room;
}
