import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('charge')
  createCharge(@Request() req: any, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.createCharge(req.user.userId, dto);
  }

  @Get('my')
  findMine(@Request() req: any) {
    return this.paymentsService.findByPatient(req.user.userId);
  }
}
