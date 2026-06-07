import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  culqiToken: string;

  @IsOptional()
  @IsString()
  packageId?: string;

  @IsOptional()
  @IsString()
  serviceId?: string;

  @IsEnum(['PEN', 'USD'])
  currency: 'PEN' | 'USD';

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  email?: string;
}
