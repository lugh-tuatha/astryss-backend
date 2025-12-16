import { Body, Controller, Get, HttpStatus, Param, ParseFilePipeBuilder, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { EntriesService } from './entries.service';
import { CreateEntryDTO } from './dto/create-entry.dto';
import { EntryDocument } from './schemas/entry.schema';
import { CursorPaginationResponse } from 'src/common/responses/cursor-pagination.response';
import { GetEntriesDTO } from './dto/get-entries.dto';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @UseInterceptors(ResponseInterceptor)
  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async uploadAvatar(
    @Body() createEntryDTO: CreateEntryDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.(png|jpg|jpeg)',
        })
        .addMaxSizeValidator({
          maxSize: MAX_FILE_SIZE,
          message: "File size must be less than 2MB.",
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        }),
    ) image?: Express.Multer.File
  ): Promise<EntryDocument> {
    return this.entriesService.createEntry(createEntryDTO, image);
  }

  @Get()
  async getEntries(
    @Query() filters: GetEntriesDTO
  ): Promise<CursorPaginationResponse<EntryDocument>> {
    return this.entriesService.getEntries(filters);
  }

  @UseInterceptors(ResponseInterceptor)
  @Get(':id')
  async getEntryById(
    @Param('id') id: string
  ): Promise<EntryDocument> {
    return this.entriesService.getEntryById(id);
  }
}
