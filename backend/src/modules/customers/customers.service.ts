import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from './entity/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private repo: Repository<Customer>,
  ) {}

  create(dto: CreateCustomerDto) {
    const customer = this.repo.create(dto);
    return this.repo.save(customer);
  }

  findAll() {
    return this.repo.find();
  }
}
