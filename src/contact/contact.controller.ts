import { Controller, Post, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  // Público - cualquier visitante puede enviar un mensaje
  @Post()
  create(@Body() dto: CreateContactDto) {
    return this.contactService.create(dto);
  }

  // Solo Admin
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.contactService.findAll();
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }
}
