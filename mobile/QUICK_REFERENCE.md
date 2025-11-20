# 🎵 REFERÊNCIA RÁPIDA - User Authentication

## Setup Rápido (Copy & Paste)

### 1. Adicione Redirect URI no Spotify Dashboard

```
Settings → Redirect URIs → Add:
http://localhost:8081
```

### 2. Instale Dependências

```bash
cd mobile
npm install --legacy-peer-deps
```

### 3. Configure .env.local

```
REACT_APP_SPOTIFY_CLIENT_ID=seu_id
REACT_APP_SPOTIFY_CLIENT_SECRET=seu_secret
REACT_APP_SPOTIFY_REDIRECT_URI=http://localhost:8081
```

### 4. Use na App

```jsx
import SpotifyLogin from './src/components/SpotifyLogin';

export default function App() {
  return <SpotifyLogin />;
}
```

---

## Funções Principais (Copy & Paste)

### Login
```javascript
import { loginWithSpotifyWeb } from '../services/spotifyUserAuth';
await loginWithSpotifyWeb();
```

### Logout
```javascript
import { logoutSpotify } from '../services/spotifyUserAuth';
await logoutSpotify();
```

### Top Tracks
```javascript
import { getUserTopTracks } from '../services/spotifyUserApi';
const tracks = await getUserTopTracks('long_term', 20);
```

### Curtidas
```javascript
import { getUserSavedTracks } from '../services/spotifyUserApi';
const { tracks } = await getUserSavedTracks(20);
```

### Playlists
```javascript
import { getUserPlaylists } from '../services/spotifyUserApi';
const playlists = await getUserPlaylists(20);
```

### Artistas
```javascript
import { getUserTopArtists } from '../services/spotifyUserApi';
const artists = await getUserTopArtists('long_term', 20);
```

### Curtir Música
```javascript
import { saveTrack } from '../services/spotifyUserApi';
await saveTrack(trackId);
```

### Descurtir
```javascript
import { removeTrack } from '../services/spotifyUserApi';
await removeTrack(trackId);
```

### Tocar Música
```javascript
import { playTrack } from '../services/spotifyUserApi';
await playTrack('spotify:track:3qm84nBvXcjf6OdNwVCM57');
```

### Pausar
```javascript
import { pausePlayback } from '../services/spotifyUserApi';
await pausePlayback();
```

### Skip
```javascript
import { skipToNext } from '../services/spotifyUserApi';
await skipToNext();
```

---

## Componentes Prontos

### Login Form
```jsx
import SpotifyLogin from '../components/SpotifyLogin';

<SpotifyLogin onLoginSuccess={(user) => {
  console.log('User:', user);
}} />
```

---

## Scopes Configurados

```
✅ user-read-private
✅ user-read-email
✅ user-top-read
✅ user-library-read
✅ user-read-playback-state
✅ user-modify-playback-state
✅ user-read-currently-playing
✅ playlist-read-private
✅ playlist-read-collaborative
```

Para adicionar mais, edite `spotifyUserAuth.js` - const SCOPES

---

## Common Errors

| Erro | Solução |
|------|---------|
| "Invalid redirect URI" | Adicione no Spotify Dashboard Settings |
| "Invalid client secret" | Regenere no Spotify Dashboard |
| "User not logged in" | Chame login primeiro |
| "No access token" | Verifique .env.local |

---

## File Reference

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `spotifyUserAuth.js` | Service | OAuth + Auth |
| `spotifyUserApi.js` | Service | User Data |
| `SpotifyLogin.jsx` | Component | UI Login |
| `USER_AUTH_SETUP.md` | Doc | Setup Detalhado |
| `USER_AUTH_EXAMPLES.js` | Examples | 7 Exemplos |

---

## Próximas Features

- [ ] Save preferences (dark mode)
- [ ] Share tracks no social media
- [ ] Criar playlists
- [ ] Modificar playlists
- [ ] Advanced player UI

---

**Pronto para integrar!** 🎵
