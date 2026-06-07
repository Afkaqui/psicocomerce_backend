import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(patientId: string, dto: CreateAppointmentDto) {
    // Verificar que el paciente existe
    const patient = await this.prisma.patient.findFirst({
      where: { userId: patientId },
    });
    if (!patient) throw new NotFoundException('Paciente no encontrado');

    // Verificar que el servicio existe
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
    });
    if (!service) throw new NotFoundException('Servicio no encontrado');

    const appointment = await this.prisma.appointment.create({
      data: {
        patientId: patient.id,
        psychologistId: dto.psychologistId,
        serviceId: dto.serviceId,
        scheduledAt: new Date(dto.scheduledAt),
        durationMin: service.durationMin,
        notes: dto.notes,
      },
      include: {
        psychologist: { select: { firstName: true, lastName: true } },
        service: { select: { name: true, sessionType: true } },
      },
    });

    // TODO: Crear evento en Google Calendar
    // TODO: Enviar email de confirmación via Resend

    return appointment;
  }

  async findByPatient(userId: string) {
    const patient = await this.prisma.patient.findFirst({
      where: { userId },
    });
    if (!patient) return [];

    return this.prisma.appointment.findMany({
      where: { patientId: patient.id },
      orderBy: { scheduledAt: 'desc' },
      include: {
        psychologist: { select: { firstName: true, lastName: true, photoUrl: true } },
        service: { select: { name: true, sessionType: true } },
      },
    });
  }

  async findByPsychologist(userId: string) {
    const psychologist = await this.prisma.psychologist.findFirst({
      where: { userId },
    });
    if (!psychologist) return [];

    return this.prisma.appointment.findMany({
      where: { psychologistId: psychologist.id },
      orderBy: { scheduledAt: 'asc' },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        service: { select: { name: true, sessionType: true } },
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status: status as any },
    });
  }
}
