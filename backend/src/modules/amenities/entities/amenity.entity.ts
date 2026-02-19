import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Amenity')
export class Amenity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;
}
