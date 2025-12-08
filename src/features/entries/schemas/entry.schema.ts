import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { EntryType } from "../enums/entry-type.enum";
import { Emotion } from "../enums/emotion.enum";
import { HydratedDocument } from "mongoose";

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'entries'
})
export class Entry {
  @Prop({ name: 'display_name', default: 'Anonymous', maxlength: 20, trim: true })
  displayName?: string;

  @Prop({ required: false, default: 'Untitled', maxlength: 25, trim: true })
  title?: string;

  @Prop({ required: true, maxlength: 500, trim: true })
  content: string;

  @Prop({ name: 'avatar_url', default: null })
  avatarUrl?: string;
  
  @Prop({ required: true, enum: Object.values(EntryType), index: true })
  type: string;

  @Prop({ enum: Object.values(Emotion), default: 'other', index: true })
  emotion?: string;

  @Prop()
  variants: string[];
   
  // @Prop({ enum: ['positive', 'negative', 'complex', 'neutral'], default: 'neutral', index: true })
  // sentiment?: string;
}

export const EntrySchema = SchemaFactory.createForClass(Entry);
export type EntryDocument = HydratedDocument<Entry>;