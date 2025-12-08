import { Body, Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { CreateEntryDTO } from './dto/create-entry.dto';
import { EntryDocument } from './schemas/entry.schema';
import { CursorPaginationResponse } from 'src/shared/cursor-pagination.response';
import { GetEntriesDTO } from './dto/get-entries.dto';

@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @Post()
  async createEntry(
    @Body() createEntryDTO: CreateEntryDTO
  ): Promise<EntryDocument> {
    return this.entriesService.createEntry(createEntryDTO);
  }

  @Get()
  async getEntries(
    @Query() filters: GetEntriesDTO
  ): Promise<CursorPaginationResponse<EntryDocument>> {
    return this.entriesService.getEntries(filters);
  }
}
