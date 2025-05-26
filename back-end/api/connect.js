// JavaScript Assincrono
// await async
// Fullfilled
import { MongoClient } from "mongodb";

const URI =
  "mongodb+srv://lobastos:F&vb2$QDN/#NH/r@databases.gflodgd.mongodb.net/?retryWrites=true&w=majority&appName=DATABASES";

const client = new MongoClient(URI);

export const db = client.db("spotifyAula");
// const songCollection = await db.collection("songs").find({}).toArray();

// console.log(songCollection);
