import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity'; // Adjust the import path as needed

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>
  ) {}

  async findAll(): Promise<Service[]> {
    return this.serviceRepository.find();
  }

  async findOne(id: number): Promise<Service | null> {
    return this.serviceRepository.findOne({ 
      where: { id } 
    });
  }

  async getServiceIdByName(name: string): Promise<number> {
    const service = await this.serviceRepository.findOne({ 
      where: { name } 
    });

    if (!service) {
      throw new NotFoundException(`Service with name ${name} not found`);
    }

    return service.id;
  }
}