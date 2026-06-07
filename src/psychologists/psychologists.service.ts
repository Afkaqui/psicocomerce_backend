import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PsychologistsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.psychologist.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        slug: true,
        title: true,
        specialty: true,
        areas: true,
        languages: true,
        bio: true,
        quote: true,
        photoUrl: true,
        yearsExperience: true,
      },
    });
  }

  async findBySlug(slug: string) {
    const psychologist = await this.prisma.psychologist.findUnique({
      where: { slug },
      include: {
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            sessionType: true,
            description: true,
            durationMin: true,
            pricePen: true,
            priceUsd: true,
          },
        },
      },
    });

    if (!psychologist) {
      throw new NotFoundException('Psicólogo no encontrado');
    }

    return psychologist;
  }
}
