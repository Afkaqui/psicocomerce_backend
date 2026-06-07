import { Controller, Get } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get('packages')
  findPackages() {
    return this.servicesService.findPackages();
  }
}
