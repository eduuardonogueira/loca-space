import { EnumUserRole, EnumUserType } from 'src/types/user';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: EnumUserType, default: EnumUserType.EXTERNO })
  type: EnumUserType;

  @Column({ type: 'enum', enum: EnumUserRole, default: EnumUserRole.USER })
  role: EnumUserRole;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  updatedAt: Date | null;
}
