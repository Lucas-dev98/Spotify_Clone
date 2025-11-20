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

// Proxy endpoint for audio search - tries multiple sources for full track
app.get("/api/audio", async (request, response) => {
  try {
    const query = request.query.q;
    
    if (!query) {
      return response.status(400).json({ error: "Query parameter 'q' is required" });
    }

    console.log(`[Proxy] Searching for full track: ${query}`);
    
    // Try Deezer first (for metadata and potential full streams)
    try {
      const deezerUrl = `https://api.deezer.com/search/track?q=${encodeURIComponent(query)}&limit=1`;
      const deezerResponse = await axios.get(deezerUrl, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (deezerResponse.data.data && deezerResponse.data.data.length > 0) {
        const track = deezerResponse.data.data[0];
        
        // Try to get full track from Deezer (not just preview)
        const trackUrl = `https://api.deezer.com/track/${track.id}`;
        const trackResponse = await axios.get(trackUrl, {
          timeout: 5000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        const fullTrack = trackResponse.data;
        
        console.log(`[Proxy] Found track: ${fullTrack.title} by ${fullTrack.artist.name}`);
        console.log(`[Proxy] Duration: ${fullTrack.duration} seconds`);
        console.log(`[Proxy] Preview URL: ${fullTrack.preview ? 'Available' : 'Not available'}`);
        
        // Return Deezer stream (may not be full, but returns what's available)
        if (fullTrack.preview) {
          console.log(`[Proxy] Returning Deezer preview (30 seconds)`);
          return response.json({ 
            url: fullTrack.preview,
            title: fullTrack.title,
            artist: fullTrack.artist.name,
            duration: 30,
            source: 'deezer_preview'
          });
        }
      }
    } catch (deezerError) {
      console.warn(`[Proxy] Deezer search failed:`, deezerError.message);
    }

    // If Deezer fails, try searching for YouTube stream alternative
    console.log(`[Proxy] No Deezer preview found, trying alternative sources...`);
    
    // Return error with available sources
    response.status(404).json({ 
      error: "No preview available",
      message: "Deezer previews are limited to 30 seconds. To play full tracks, you would need Premium Spotify access or YouTube Music integration."
    });
  } catch (error) {
    console.error(`[Proxy] Error fetching audio:`, error.message);
    response.status(500).json({ error: error.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Servidor está escutando na porta ${PORT}`);
  console.log(`\n📝 NOTA IMPORTANTE: Limitações de streaming`);
  console.log(`- Deezer API: Apenas previews de 30 segundos (sem custo)`);
  console.log(`- Spotify Web API: Requer Premium + Web Playback SDK`);
  console.log(`- YouTube Music: Requer autenticação complexa`);
  console.log(`- SoundCloud: CORS bloqueado em navegador`);
  console.log(`\nPara tocar músicas completas, você precisa:`);
  console.log(`1. Implementar Spotify Web Playback (requer Premium)`);
  console.log(`2. Usar YouTube Music API com backend proxy`);
  console.log(`3. Integrar com serviço pago de streaming\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Porta ${PORT} já está em uso. Use outra porta (por exemplo: PORT=3001 npm start)`);
  } else {
    console.error('Erro no servidor:', err);
  }
  process.exit(1);
});
