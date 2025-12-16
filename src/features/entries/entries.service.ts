import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { Entry, EntryDocument } from './schemas/entry.schema';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

import cloudinary from 'src/config/cloudinary.config';
import { CreateEntryDTO } from './dto/create-entry.dto';
import { GetEntriesDTO } from './dto/get-entries.dto';
import { CursorPaginationResponse } from 'src/common/responses/cursor-pagination.response';

@Injectable()
export class EntriesService {
  constructor( @InjectModel(Entry.name) private entryModel: Model<Entry> ) {}
  
  async createEntry(createEntryDTO: CreateEntryDTO, image?: Express.Multer.File): Promise<EntryDocument> {
    const avatarUrl = image
      ? (await this.handleFileUpload(image)).secure_url 
      : `https://api.dicebear.com/9.x/pixel-art/svg?seed=${createEntryDTO.displayName}&size=80`;

    const entry = await this.entryModel.create({
      ...createEntryDTO,
      avatarUrl,
    });

    return entry;
  }

  async getEntries(filters: GetEntriesDTO): Promise<CursorPaginationResponse<EntryDocument>> {
    const { type, emotion, limit = 20, cursor } = filters;

    const filter: FilterQuery<EntryDocument> = {};
    
    if (cursor) {
      filter._id = { $lt: new Types.ObjectId(cursor) };
    }

    if (type) {
      filter.type = type;
    }

    if (emotion) {
      filter.emotion = emotion;
    }

    const entries = await this.entryModel
      .find(filter)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .exec();

    const hasMore = entries.length > limit;
    const data = hasMore ? entries.slice(0, limit) : entries;
    const nextCursor = hasMore ? entries[limit]._id.toString() : null;

    const total = !cursor 
      ? await this.entryModel.countDocuments(filter)
      : undefined;

    return {
      data,
      meta: {
        limit,
        total,
        nextCursor,
        hasMore,
      },
    };
  }

  async getEntryById(id: string): Promise<EntryDocument> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid entry ID");
    }

    const entry = await this.entryModel.findById(id).exec();

    if (!entry) {
      throw new NotFoundException("Entry not found");
    }

    return entry;
  }

  async handleFileUpload(image: Express.Multer.File): Promise<UploadApiResponse> {
    const fileNameWithoutExt = image.originalname.replace(/\.[^/.]+$/, '');
    const uniquePublicId = `${fileNameWithoutExt}_${Date.now()}`;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "astryss-avatars",
          public_id: uniquePublicId,
          resource_type: 'image',
          format: 'webp',
          transformation: [
            {
              width: 200,
              height: 200,
              crop: 'fill',
              gravity: 'face',
              quality: 'auto:good',
            },
          ]
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      uploadStream.end(image.buffer); 
    });
  }
}
