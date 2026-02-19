import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Room } from '../../room/entities/room.entity';
import { Amenity } from '../../amenities/entities/amenity.entity';

@Entity('RoomAmenity')
export class RoomAmenity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'roomId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_Room_RoomAmenity',
  })
  room: Room;

  @ManyToOne(() => Amenity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'amenityId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_Amenity_RoomAmenity',
  })
  amenity: Amenity;
}
