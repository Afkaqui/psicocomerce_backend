import { Controller, Get, Param } from '@nestjs/common';
import { PsychologistsService } from './psychologists.service';

@Controller('psychologists')
export class PsychologistsController {
  constructor(private psychologistsService: PsychologistsService) {}

  @Get()
  findAll() {
    return this.psychologistsService.findAll();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.psychologistsService.findBySlug(slug);
  }
}
