import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Service } from './service.entity';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async findAll(): Promise<Service[]> {
    return this.servicesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Service> {
    const service = await this.servicesService.findOne(+id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<Service> {
    try {
      const serviceId = await this.servicesService.getServiceIdByName(name);
      const service = await this.servicesService.findOne(serviceId);
      if (!service) {
        throw new NotFoundException(`Service with name ${name} not found`);
      }
      return service;
    } catch (error) {
      throw new NotFoundException(`Service with name ${name} not found`);
    }
  }
}