import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
      role: Role.COLLABORATOR,
    });

    return this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
