import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { title } from 'process';
dotenv.config();

// === Utils ===
const capitalize = (str?: string | null): string | null => {
  if (!str) return null;
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// === Main migration ===
(async () => {
  const v1 = await mongoose.createConnection(process.env.MONGO_URI_V1!).asPromise();
  const v2 = await mongoose.createConnection(process.env.MONGO_URI!).asPromise();

  const V1Post = v1.model('V1Emotion', new mongoose.Schema({}, { strict: false }), 'emotions');
  const V2Entry = v2.model('Entry', new mongoose.Schema({}, { strict: false }), 'entries');

  const oldDocs = await V1Post.find();

  console.log("Fetched V1 documents:", oldDocs.length);

  const emotionMap: Record<string, string> = {
    uncategorize: "other",
    love: "inlove",
    sadness: "sad",
    anger: "angry"
  };

  const transformed = oldDocs.map((doc: any) => ({
    _id: doc._id,
    displayName: capitalize(doc.codename),
    title: doc.title,
    content: doc.summary ?? "",
    avatarUrl: doc.cover && doc.cover.trim() !== "" ? doc.cover : "/avatar_default_0.webp",
    type: "release",
    variants: ["legacy"],
    emotion: emotionMap[doc.category],
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
  }));

  await V2Entry.insertMany(transformed);

  console.log("Migration complete!");
  process.exit();
})();
