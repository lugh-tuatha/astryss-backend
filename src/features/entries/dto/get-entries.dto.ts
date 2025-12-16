import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { PAGINATION } from "src/shared/constants/pagination.constants";
import { EntryType } from "../enums/entry-type.enum";
import { Emotion } from "../enums/emotion.enum";

export class GetEntriesDTO {
  @IsOptional()
  @IsEnum(EntryType)
  type?: EntryType;

  @IsOptional()
  @IsEnum(Emotion)
  emotion?: Emotion;
  
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(PAGINATION.MIN_LIMIT)
  @Max(PAGINATION.MAX_LIMIT)
  limit: number = PAGINATION.DEFAULT_LIMIT;
}