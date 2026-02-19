import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { RoomAmenity } from '../../room-amenities/entities/room-amenity.entity';
import { EnumRoomType } from 'src/types/room';
import { EnumRoomStatus } from 'src/types/room';
import { User } from '../../user/entities/user.entity';
import { Address } from '../../address/entities/address.entity';
import { Favorite } from '../../favorite/entities/favorite.entity';

@Entity('Room')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  userId: number;

  @ManyToOne(() => User, (user) => user.rooms)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true, type: 'float' })
  size: number; // Area m2

  @OneToOne(() => Address, (address) => address.room, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  address: Address;

  @Column({ nullable: true, type: 'int' })
  totalSpace: number; // Capacity (people)

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value) => value,
      from: (value) => parseFloat(value),
    },
  })
  price: number;

  @Column({
    type: 'enum',
    enum: EnumRoomStatus,
    default: EnumRoomStatus.AVAILABLE,
  })
  status: EnumRoomStatus;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  imageUrl: string | null;

  @Column({ nullable: true })
  parkingSlots: number;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  type: string;

  @OneToMany(() => RoomAmenity, (roomAmenity) => roomAmenity.room, {
    cascade: true,
  })
  roomAmenities: RoomAmenity[];

  @OneToMany(() => Favorite, (favorite) => favorite.room)
  favorites: Favorite[];
}
