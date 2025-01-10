import {
  IsString,
  IsOptional,
  IsUrl,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class ShortenUrlDto {
  @IsUrl({}, { message: 'Invalid URL' })
  originalUrl: string;

  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Custom alias must not exceed 20 characters' })
  customAlias?: string;
  @IsNumber()
  @IsOptional()
  durationMinutes?: number;
}
