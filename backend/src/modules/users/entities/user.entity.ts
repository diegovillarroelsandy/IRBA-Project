import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from '../enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.COLLABORATOR,
  })
  role!: Role;

  @Column({ default: true })
  isActive!: boolean;
}
