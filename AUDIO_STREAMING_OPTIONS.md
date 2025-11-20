# Opções de Streaming de Áudio Completo

## Situação Atual
Atualmente, o app toca previews de 30 segundos do Deezer (gratuito, sem autenticação).

## Opção 1: Spotify Web Playback SDK (RECOMENDADA)
**Requisitos:**
- Conta Spotify (não precisa de Premium)
- Spotify App instalado NO CELULAR ou Premium Web
- Access Token válido do Spotify

**Implementação:**
```javascript
// 1. Instalar @spotify/web-api-js
npm install @spotify/web-api-js

// 2. Usar Web Playback SDK
const script = document.createElement('script');
script.src = 'https://sdk.scdn.co/spotify-player.js';
document.head.appendChild(script);

// 3. Inicializar player
window.onSpotifyWebPlaybackSDKReady = () => {
  const token = YOUR_ACCESS_TOKEN;
  const player = new Spotify.Player({
    name: 'Spotify Clone',
    getOAuthToken: callback => callback(token),
    volume: 0.5
  });
  player.addListener('player_state_changed', state => {
    // Handle playback state
  });
};
```

**Vantagens:**
- Toca música completa
- Qualidade superior
- Sem limite de duração

**Desvantagens:**
- Requer Spotify Premium OU Spotify App no celular
- Mais complexo de implementar

---

## Opção 2: YouTube Music com yt-dlp (Backend)
**Requisitos:**
- yt-dlp instalado no servidor
- Fazer proxy de streams via backend

**Implementação:**
```javascript
// Backend - Node.js + yt-dlp
const { execSync } = require('child_process');

app.get('/api/youtube-stream', async (req, res) => {
  const query = req.query.q;
  try {
    // yt-dlp extrai stream direto do YouTube
    const cmd = `yt-dlp -f 251 -g "ytsearch:${query}"`;
    const url = execSync(cmd).toString().trim();
    
    // Fazer proxy do stream
    const stream = await axios.get(url, { responseType: 'stream' });
    res.setHeader('Content-Type', 'audio/mp4');
    stream.data.pipe(res);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

**Vantagens:**
- Toca música completa
- Sem limite
- Funciona para qualquer música

**Desvantagens:**
- Carregamento mais lento (yt-dlp leva tempo)
- Pode violar YouTube ToS
- Alto uso de banda

---

## Opção 3: SoundCloud API
**Requisitos:**
- SoundCloud Client ID
- Algumas músicas têm streams completos

**Implementação:**
```javascript
const CLIENT_ID = 'your_soundcloud_client_id';

app.get('/api/soundcloud', async (req, res) => {
  const query = req.query.q;
  try {
    const searchUrl = `https://api.soundcloud.com/tracks?q=${query}&client_id=${CLIENT_ID}`;
    const response = await axios.get(searchUrl);
    
    if (response.data[0] && response.data[0].stream_url) {
      return res.json({
        url: response.data[0].stream_url + '?client_id=' + CLIENT_ID,
        title: response.data[0].title,
        duration: response.data[0].duration / 1000
      });
    }
    res.status(404).json({ error: 'No stream found' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

**Vantagens:**
- API pública
- Muitas músicas têm streams completos

**Desvantagens:**
- Nem todas as músicas estão disponíveis
- Qualidade variável
- CORS pode bloquear

---

## Opção 4: Last.fm + Scrobbling (Mínimo)
Apenas scrobbling, não resolve o problema de streaming.

---

## RECOMENDAÇÃO

**Melhor solução para seu caso:**
Usar **Spotify Web Playback SDK** com fallback para **Deezer previews**.

**Implementação:**
1. Tentar reproduzir via Spotify Web Playback SDK
2. Se não conseguir (sem Premium), mostrar preview Deezer
3. Oferecer botão "Abrir no Spotify" para ouvir completo

**Ou:**
Usar **YouTube Music com yt-dlp** no backend (mais trabalhoso mas funciona).

---

## Próximas Etapas (Se quiser implementar)

1. Escolher opção (recomendo Spotify Web Playback)
2. Instalar dependências
3. Atualizar endpoint `/api/audio`
4. Modificar Player.jsx para suportar novo tipo de stream
5. Testar com múltiplas músicas

## Status Atual
✅ Deezer 30s preview - FUNCIONANDO
❌ Spotify completo - NÃO IMPLEMENTADO (requer Web Playback SDK)
❌ YouTube completo - NÃO IMPLEMENTADO (requer yt-dlp)
