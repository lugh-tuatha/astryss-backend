import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";
import { EntryType } from "../enums/entry-type.enum";
import { Emotion } from "../enums/emotion.enum";

export class CreateEntryDTO {
  @IsOptional()
  @IsString()
  @MaxLength(15)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  title?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  content: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  avatarUrl?: string
  
  @IsNotEmpty()
  @IsEnum(EntryType)
  type: string;

  @IsOptional()
  @IsEnum(Emotion)
  emotion?: string;

  @IsOptional()
  @IsArray()
  variants?: string[];
}