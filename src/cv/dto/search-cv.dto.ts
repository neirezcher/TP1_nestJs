// search-cv.dto.ts
import { IsOptional, IsString, IsNumber,IsInt,Min } from 'class-validator';

export class SearchCVDto {
  @IsOptional()
  @IsString()
  criteria?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number;

}
