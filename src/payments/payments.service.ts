import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  private culqiSecretKey: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.culqiSecretKey = this.config.get<string>('CULQI_SECRET_KEY', '');
  }

  async createCharge(userId: string, dto: CreatePaymentDto) {
    // Buscar paciente
    const patient = await this.prisma.patient.findFirst({
      where: { userId },
    });
    if (!patient) throw new BadRequestException('Paciente no encontrado');

    // Monto en centavos (Culqi usa centavos)
    const amountInCents = Math.round(dto.amount * 100);

    try {
      // TODO: Integrar culqi-node SDK
      // const culqi = new Culqi({ privateKey: this.culqiSecretKey });
      // const charge = await culqi.charges.create({
      //   amount: amountInCents,
      //   currency_code: dto.currency,
      //   email: dto.email,
      //   source_id: dto.culqiToken,
      //   description: 'Espacio Resiliente - Servicio de Psicología',
      // });

      // Crear registro de compra
      const purchase = await this.prisma.purchase.create({
        data: {
          patientId: patient.id,
          packageId: dto.packageId,
          currency: dto.currency,
          amount: dto.amount,
          paymentStatus: 'COMPLETED', // Cambiar tras integración real
          paymentMethod: 'card',
          culqiChargeId: `mock_${Date.now()}`, // Reemplazar con charge.id
          sessionsTotal: dto.packageId ? undefined : 1,
        },
      });

      // Si compró paquete, actualizar sessionsTotal
      if (dto.packageId) {
        const pkg = await this.prisma.package.findUnique({
          where: { id: dto.packageId },
        });
        if (pkg) {
          await this.prisma.purchase.update({
            where: { id: purchase.id },
            data: { sessionsTotal: pkg.sessionsTotal },
          });

          // Activar acceso a intranet
          await this.prisma.intranetAccess.create({
            data: {
              patientId: patient.id,
              isActive: true,
            },
          });
        }
      }

      return {
        success: true,
        purchaseId: purchase.id,
        message: 'Pago procesado exitosamente',
      };
    } catch (error) {
      throw new BadRequestException('Error al procesar el pago: ' + error.message);
    }
  }

  async findByPatient(userId: string) {
    const patient = await this.prisma.patient.findFirst({
      where: { userId },
    });
    if (!patient) return [];

    return this.prisma.purchase.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: 'desc' },
      include: {
        package: { select: { name: true, sessionsTotal: true } },
      },
    });
  }
}
