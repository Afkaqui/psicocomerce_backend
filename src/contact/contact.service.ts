import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(dto: CreateContactDto) {
    const message = await this.prisma.contactMessage.create({
      data: {
        name: dto.name,
        email: dto.email,
        message: dto.message,
      },
    });

    // Notificar al admin via email
    await this.emailService.sendContactNotification(dto);

    return {
      success: true,
      message: 'Mensaje enviado correctamente. Te responderemos pronto.',
    };
  }

  async findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }
}
