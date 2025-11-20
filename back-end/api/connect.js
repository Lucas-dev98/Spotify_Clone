// JavaScript Assincrono
// await async
// Fullfilled
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import fs from "fs/promises";

// Load environment variables from a .env file (if present)
dotenv.config();

// Prefer MONGODB_URI from environment for security; fallback to the in-repo URI
const URI = process.env.MONGODB_URI ||
  "mongodb+srv://lobastos:F&vb2$QDN/#NH/r@databases.gflodgd.mongodb.net/?retryWrites=true&w=majority&appName=DATABASES";

// Helper to build a simple mock `db` that reads from local JSON files.
async function buildMockDb() {
  try {
    const [artistsRaw, songsRaw] = await Promise.all([
      fs.readFile(new URL('./data/artists.json', import.meta.url), 'utf8'),
      fs.readFile(new URL('./data/songs.json', import.meta.url), 'utf8'),
    ]);

    const artists = JSON.parse(artistsRaw);
    const songs = JSON.parse(songsRaw);

    return {
      collection(name) {
        return {
          find() {
            return {
              toArray: async () => {
                if (name === 'artists') return artists;
                if (name === 'songs') return songs;
                return [];
              },
            };
          },
        };
      },
    };
  } catch (e) {
    console.warn('Failed to build mock DB from local JSON files:', e);
    return {
      collection() {
        return { find() { return { toArray: async () => [] }; } };
      },
    };
  }
}

let db;
// Wrap creation and connection in try/catch because constructing MongoClient
// with a malformed URI can throw synchronously (password with unescaped chars).
try {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    db = client.db('spotifyAula');
    console.log('Connected to MongoDB');
  } catch (e) {
    console.warn('Could not connect to MongoDB after creating client, falling back to local mock DB.');
    console.warn(e.message);
    db = await buildMockDb();
  }
} catch (e) {
  console.warn('Invalid MongoDB URI or failed to construct MongoClient — falling back to local mock DB.');
  console.warn(e.message);
  db = await buildMockDb();
}

export { db };
// const songCollection = await db.collection("songs").find({}).toArray();

// console.log(songCollection);
