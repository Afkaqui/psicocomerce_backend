import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  create(@Request() req: any, @Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(req.user.userId, dto);
  }

  @Get('my')
  findMine(@Request() req: any) {
    if (req.user.role === 'PSYCHOLOGIST') {
      return this.appointmentsService.findByPsychologist(req.user.userId);
    }
    return this.appointmentsService.findByPatient(req.user.userId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.appointmentsService.updateStatus(id, status);
  }
}
