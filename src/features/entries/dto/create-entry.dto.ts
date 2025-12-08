import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { EntryType } from "../enums/entry-type.enum";
import { Emotion } from "../enums/emotion.enum";

export class CreateEntryDTO {
  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string
  
  @IsNotEmpty()
  @IsEnum(EntryType)
  type: string;

  @IsOptional()
  @IsEnum(Emotion)
  emotion?: string;
}