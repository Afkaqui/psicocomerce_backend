import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  psychologistId: string;

  @IsString()
  serviceId: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
