import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;
  private fromEmail: string;
  private adminEmail: string;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY', '');
    this.resend = new Resend(apiKey);
    this.fromEmail = this.config.get<string>(
      'EMAIL_FROM',
      'Espacio Resiliente <no-reply@espacioresiliente.com>',
    );
    this.adminEmail = this.config.get<string>(
      'ADMIN_EMAIL',
      'contacto@espacioresiliente.com',
    );
  }

  async sendContactNotification(data: { name: string; email: string; message: string }) {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: this.adminEmail,
        subject: `Nuevo mensaje de contacto: ${data.name}`,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${data.message}</p>
        `,
      });
    } catch (error) {
      this.logger.error('Error enviando email de contacto', error);
    }
  }

  async sendAppointmentConfirmation(data: {
    patientEmail: string;
    patientName: string;
    psychologistName: string;
    serviceName: string;
    scheduledAt: Date;
  }) {
    try {
      const dateStr = data.scheduledAt.toLocaleDateString('es-PE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      await this.resend.emails.send({
        from: this.fromEmail,
        to: data.patientEmail,
        subject: 'Cita confirmada - Espacio Resiliente',
        html: `
          <h2>Tu cita ha sido confirmada</h2>
          <p>Hola ${data.patientName},</p>
          <p>Tu cita con <strong>${data.psychologistName}</strong> ha sido agendada:</p>
          <ul>
            <li><strong>Servicio:</strong> ${data.serviceName}</li>
            <li><strong>Fecha:</strong> ${dateStr}</li>
          </ul>
          <p>Recibirás el enlace de la sesión antes de la cita.</p>
          <p>Equipo de Espacio Resiliente</p>
        `,
      });
    } catch (error) {
      this.logger.error('Error enviando confirmación de cita', error);
    }
  }

  async sendPaymentConfirmation(data: {
    patientEmail: string;
    patientName: string;
    amount: number;
    currency: string;
    description: string;
  }) {
    try {
      const symbol = data.currency === 'PEN' ? 'S/' : '$';
      await this.resend.emails.send({
        from: this.fromEmail,
        to: data.patientEmail,
        subject: 'Pago confirmado - Espacio Resiliente',
        html: `
          <h2>Pago procesado exitosamente</h2>
          <p>Hola ${data.patientName},</p>
          <p>Hemos recibido tu pago:</p>
          <ul>
            <li><strong>Concepto:</strong> ${data.description}</li>
            <li><strong>Monto:</strong> ${symbol} ${data.amount.toFixed(2)} ${data.currency}</li>
          </ul>
          <p>Gracias por confiar en nosotros.</p>
          <p>Equipo de Espacio Resiliente</p>
        `,
      });
    } catch (error) {
      this.logger.error('Error enviando confirmación de pago', error);
    }
  }
}
