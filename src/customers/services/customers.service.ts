import { ErrorHandler } from '@/core/errors/error.handler';
import { PrismaService } from '@/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      await this.prisma.customer.create({
        data: createCustomerDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {

      const customers = await this.prisma.customer.findMany();
      return customers;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { id },
      });
      return customer;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    try {
      await this.prisma.customer.update({
        where: { id },
        data: updateCustomerDto,
      });
      return updateCustomerDto;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const customer = await this.prisma.customer.delete({
        where: { id },
      });
      if (!customer) {
        ErrorHandler.notFound('No customer found');
      }
      return customer;
    } catch (error) {
      throw error;
    }
  }
}
