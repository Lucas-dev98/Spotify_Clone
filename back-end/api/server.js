// API significa Application Programming Interface
// POST, GET, PUT, DELETE
// CRUD - Create Read Update Delete
// Endpoint
// Middleware

import express from "express";
import cors from "cors";
import axios from "axios";
import { db } from "./connect.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
// app.use(express.json());

app.get("/", (request, response) => {
  response.send("Só vamos trabalhar com os endpoints '/artists' e '/songs'");
});

app.get("/artists", async (request, response) => {
  response.send(await db.collection("artists").find({}).toArray());
});

app.get("/songs", async (request, response) => {
  response.send(await db.collection("songs").find({}).toArray());
});

// Proxy endpoint for Deezer audio search
app.get("/api/audio", async (request, response) => {
  try {
    const query = request.query.q;
    
    if (!query) {
      return response.status(400).json({ error: "Query parameter 'q' is required" });
    }

    console.log(`[Proxy] Searching Deezer for: ${query}`);
    
    const deezerUrl = `https://api.deezer.com/search/track?q=${encodeURIComponent(query)}&limit=1`;
    const deezerResponse = await axios.get(deezerUrl, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (deezerResponse.data.data && deezerResponse.data.data.length > 0) {
      const track = deezerResponse.data.data[0];
      if (track.preview) {
        console.log(`[Proxy] Found preview for: ${query}`);
        return response.json({ 
          url: track.preview,
          title: track.title,
          artist: track.artist.name
        });
      }
    }

    console.log(`[Proxy] No preview found for: ${query}`);
    response.status(404).json({ error: "No preview available" });
  } catch (error) {
    console.error(`[Proxy] Error fetching from Deezer:`, error.message);
    response.status(500).json({ error: error.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Servidor está escutando na porta ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Porta ${PORT} já está em uso. Use outra porta (por exemplo: PORT=3001 npm start)`);
  } else {
    console.error('Erro no servidor:', err);
  }
  process.exit(1);
});
