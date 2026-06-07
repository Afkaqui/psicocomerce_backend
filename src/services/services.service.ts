import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.service.findMany({
      where: { isActive: true },
      include: {
        psychologist: {
          select: { firstName: true, lastName: true, slug: true },
        },
      },
    });
  }

  async findPackages() {
    return this.prisma.package.findMany({
      where: { isActive: true },
      orderBy: { sessionsTotal: 'asc' },
    });
  }
}
