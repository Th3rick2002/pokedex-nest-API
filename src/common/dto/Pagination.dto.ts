import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(0)
  offset?: number;
}
