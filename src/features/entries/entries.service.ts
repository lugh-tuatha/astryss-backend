import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Entry, EntryDocument } from './schemas/entry.schema';
import { Model } from 'mongoose';
import { CreateEntryDTO } from './dto/create-entry.dto';
import { CursorPaginationMeta, CursorPaginationResponse } from 'src/shared/cursor-pagination.response';
import { GetEntriesDTO } from './dto/get-entries.dto';

@Injectable()
export class EntriesService {
  constructor( @InjectModel(Entry.name) private entryModel: Model<Entry> ) {}
  
  async createEntry(createEntryDTO: CreateEntryDTO): Promise<EntryDocument> {
    const entry = new this.entryModel(createEntryDTO);

    return entry.save();
  }

  async getEntries(filters: GetEntriesDTO): Promise<CursorPaginationResponse<EntryDocument>> {
    const { cursor, limit } = filters;
    
    const query = cursor
    ? { _id: { $lt: cursor } }
    : {};

    const entries = await this.entryModel
      .find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .exec();

    const total = await this.entryModel.countDocuments(query);

    const hasMore = entries.length > limit;
    const data = hasMore ? entries.slice(0, limit) : entries;
    const nextCursor = hasMore 
      ? entries[limit - 1]._id.toString() 
      : null;

    const meta: CursorPaginationMeta = {
      limit,
      total,
      nextCursor,
      hasMore,
    };

    return {
      data,
      meta,
    };
  }
}
