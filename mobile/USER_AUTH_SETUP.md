# 🔐 Spotify User Authentication Setup

## Diferenças: Client Credentials vs Authorization Code

### Client Credentials (Anterior)
- ✅ Acesso público a Spotify (buscar música, artistas, etc)
- ✅ Sem login de usuário
- ❌ Sem acesso a dados pessoais
- ❌ Sem controle de playback no device do usuário

### Authorization Code (NOVO)
- ✅ Usuário faz login com Spotify
- ✅ Acesso a dados pessoais (top tracks, liked songs, playlists)
- ✅ Controle de playback (play, pause, skip)
- ✅ Histórico de reprodução
- ✅ Mais recursos e funcionalidades

---

## 🛠️ Setup Passo a Passo

### 1. Configurar Redirect URI no Spotify Developer

#### Para Web (Navegador)

1. Vá para https://developer.spotify.com/dashboard
2. Clique na sua app
3. Vá em **Settings**
4. Em "Redirect URIs", adicione:

```
http://localhost:8081
http://localhost:3000
http://localhost:19006
```

(Estas são portas comuns do Expo para web development)

5. Clique "Add"
6. Clique "Save"

#### Para Android (Emulador/Device)

1. Obtenha seu Redirect URI executando em dev:

```bash
cd mobile
npm start
# O Expo mostrará algo como:
# exp://192.168.1.XXX:19000
```

2. Use o formato:
```
exp://192.168.1.XXX:19000
```

3. Adicione no Spotify Developer Dashboard Settings

#### Para iOS

```
exp://YOUR_EXPO_PROJECT_ID
```

Para descobrir seu project ID:
```bash
npx expo whoami  # Seu usuário
npx expo project:info  # Project ID
```

### 2. Atualizar .env.local

```bash
# Mobile/.env.local

REACT_APP_SPOTIFY_CLIENT_ID=seu_client_id
REACT_APP_SPOTIFY_CLIENT_SECRET=seu_client_secret
REACT_APP_SPOTIFY_REDIRECT_URI=http://localhost:8081  # Para web

# Para mobile, use:
# REACT_APP_SPOTIFY_REDIRECT_URI=exp://192.168.1.XXX:19000
```

### 3. Instalar Dependências

```bash
cd mobile
npm install --legacy-peer-deps
```

Novas dependências adicionadas:
- `expo-auth-session` - Para OAuth flow em React Native
- `expo-web-browser` - Para abrir browser de login
- `expo-secure-store` - Para armazenar token seguro (mobile)
- `@react-native-async-storage/async-storage` - Para cache

---

## 📝 Usar em Componentes

### Exemplo 1: Component de Login

```javascript
import SpotifyLogin from '../components/SpotifyLogin';

export default function Screen() {
  return <SpotifyLogin onLoginSuccess={(user) => console.log(user)} />;
}
```

### Exemplo 2: Obter Top Tracks do Usuário

```javascript
import { getUserTopTracks } from '../services/spotifyUserApi';

async function loadTopTracks() {
  try {
    const tracks = await getUserTopTracks('long_term', 20);
    console.log(tracks);
    // Retorna: [{ name, artist, image, duration, ... }]
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Exemplo 3: Obter Saved Tracks (Curtidas)

```javascript
import { getUserSavedTracks } from '../services/spotifyUserApi';

async function loadSavedTracks() {
  try {
    const { tracks, total } = await getUserSavedTracks(20);
    console.log(`Total curtidas: ${total}`);
    console.log(tracks); // Array de tracks
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Exemplo 4: Obter Playlists do Usuário

```javascript
import { getUserPlaylists, getPlaylistTracks } from '../services/spotifyUserApi';

async function loadPlaylists() {
  try {
    const playlists = await getUserPlaylists(10);
    
    // Obter tracks de primeira playlist
    const firstPlaylist = playlists[0];
    const { tracks } = await getPlaylistTracks(firstPlaylist.id, 20);
    
    console.log(tracks);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Exemplo 5: Controlar Playback

```javascript
import { playTrack, pausePlayback, skipToNext } from '../services/spotifyUserApi';

async function controlPlayback() {
  try {
    // Tocar música
    await playTrack('spotify:track:3qm84nBvXcjf6OdNwVCM57');
    
    // Depois de 5 segundos, pular
    setTimeout(() => skipToNext(), 5000);
    
    // Depois de 10 segundos, pausar
    setTimeout(() => pausePlayback(), 10000);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## 📊 Funções Disponíveis

### User Profile
- `getUserProfile()` - Info do usuário (nome, email, followers)
- `getCurrentUser()` - Info adicional do usuário

### Top & Library
- `getUserTopTracks(timeRange, limit)` - Top tracks (long_term, medium_term, short_term)
- `getUserTopArtists(timeRange, limit)` - Artistas favoritos
- `getUserSavedTracks(limit, offset)` - Músicas curtidas com paginação
- `isTrackSaved(trackIds)` - Verificar se track está salvo
- `saveTrack(trackId)` - Curtir uma música
- `removeTrack(trackId)` - Descurtir uma música

### Playlists
- `getUserPlaylists(limit)` - Playlists do usuário
- `getPlaylistTracks(playlistId, limit)` - Tracks de uma playlist

### Playback
- `getCurrentlyPlaying()` - Música tocando agora
- `getRecentlyPlayed(limit)` - Histórico recente
- `playTrack(uri)` - Tocar música
- `pausePlayback()` - Pausar
- `skipToNext()` - Próxima música

### Auth
- `loginWithSpotifyWeb()` - Login em web
- `loginWithSpotifyMobile()` - Login em mobile
- `logoutSpotify()` - Fazer logout
- `isUserLoggedIn()` - Verificar se logado
- `getUserToken()` - Obter token (refresh se necessário)

---

## 🔐 Scopes Configurados

Sua app tem acesso a estes scopes:

```
user-read-private          → Ler perfil privado
user-read-email            → Ler email
user-top-read              → Ler top tracks/artistas
user-library-read          → Ler saved tracks
user-read-playback-state   → Ler estado do player
user-modify-playback-state → Controlar playback
user-read-currently-playing → Ler música tocando
playlist-read-private      → Ler playlists privadas
playlist-read-collaborative → Ler playlists colaborativas
```

Se precisar de mais (criar playlists, modificar, etc), adicione em `spotifyUserAuth.js`:

```javascript
const SCOPES = [
  // ... existentes
  'playlist-modify-public',      // Criar playlists públicas
  'playlist-modify-private',     // Criar playlists privadas
  'user-library-modify',         // Curtir/descurtir
];
```

---

## 🧪 Testar Localmente

### 1. Web (Navegador)

```bash
cd mobile
npm start
# Pressione 'w' para web
# Acesse http://localhost:8081
# Clique "Login com Spotify"
```

### 2. Mobile (Android Emulador)

```bash
# Terminal 1: Inicie Expo
cd mobile
npm start

# Terminal 2: Inicie emulador
emulator -avd Medium_Phone_API_36.1 &

# Pressione 'a' no Expo para abrir no emulador
```

### 3. Verificar Login

Se vir o componente **SpotifyLogin** com botão "Login com Spotify":
✅ Setup funcionando!

Após clicar, será redirecionado para https://accounts.spotify.com/authorize
✅ Se pediu permissão, setup está correto!

---

## ❌ Problemas Comuns

### "Invalid redirect URI"

✅ Verifique que o Redirect URI foi adicionado **exatamente** como está no seu .env.local
✅ URLs são case-sensitive
✅ Não inclua trailing slash se não tiver

### "Invalid client secret"

✅ Verifique .env.local
✅ Regenere Client Secret no Spotify Dashboard se necessário

### "Redirect URI doesn't match"

✅ Adicione http://localhost:8081 no Settings do Spotify Developer
✅ Para mobile, adicione o exp:// URL que Expo mostra

### "No access token received"

✅ Verifique se Spotify OAuth autorização foi concluída
✅ Veja console logs para mensagens de erro

---

## 🚀 Próximos Steps

1. Integre `SpotifyLogin` na sua app (ex: como tela inicial)
2. Depois de login bem-sucedido, carregue dados do usuário
3. Crie páginas para mostrar:
   - Top Tracks
   - Top Artists
   - Saved Tracks (Curtidas)
   - Playlists
   - Recently Played

4. Implemente player com playback control

---

## 📚 Referências

- Spotify Web API OAuth: https://developer.spotify.com/documentation/web-api/concepts/authorization
- Expo Auth Session: https://docs.expo.dev/modules/expo-auth-session/
- Spotify API Reference: https://developer.spotify.com/documentation/web-api/reference/

---

**Pronto para integrar user authentication!** 🎵
