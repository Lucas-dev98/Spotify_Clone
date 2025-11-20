# Spotify React Native App

Uma aplicação React Native (Expo) que integra a **Spotify Web API** para buscar e reproduzir músicas em web e mobile.

## 🎵 Funcionalidades

- ✅ Busca de músicas e artistas via Spotify API
- ✅ Reprodução de áudio preview com expo-av
- ✅ Interface responsiva (web + mobile Android/iOS)
- ✅ Navegação entre artistas, músicas e detalhes
- ✅ Player com controles de play/pause
- ✅ Fallback para dados locais se API indisponível

## 🔧 Configuração

### 1. Obter Credenciais do Spotify

1. Acesse https://developer.spotify.com/dashboard
2. Faça login ou crie uma conta
3. Crie uma nova aplicação
4. Aceite os termos e clique "Create App"
5. Na página da app, copie:
   - **Client ID**
   - **Client Secret** (clique "Show Client Secret")

### 2. Adicionar Credenciais ao Projeto

Crie um arquivo `.env.local` na pasta `mobile/`:

```bash
cd mobile
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais:

```env
REACT_APP_SPOTIFY_CLIENT_ID=seu_client_id_aqui
REACT_APP_SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
```

⚠️ **IMPORTANTE**: Nunca faça commit do arquivo `.env.local` (já está em `.gitignore`)

### 3. Instalar Dependências

```bash
cd mobile
npm install --legacy-peer-deps
```

### 4. Iniciar o App

#### Web (Navegador)
```bash
cd mobile
npm start
# Pressione 'w' para abrir no navegador
```

#### Android (Emulador)
```bash
cd mobile
npm start
# Pressione 'a' para abrir no emulador Android
```

#### iOS
```bash
cd mobile
npm start
# Pressione 'i' para abrir no simulador iOS
```

## 📁 Estrutura de Arquivos

```
mobile/
├── src/
│   ├── services/
│   │   ├── spotifyAuth.js       # Autenticação OAuth Spotify
│   │   └── spotifyApi.js        # Métodos da Spotify Web API
│   ├── config/
│   │   ├── spotifyConfig.js     # Configuração Spotify
│   │   └── config.js            # Config geral (API URL)
│   ├── pages/
│   │   ├── Home.jsx             # Página inicial (nova - com Spotify)
│   │   ├── Song.jsx             # Detalhes da música + Player
│   │   ├── Songs.jsx            # Lista de músicas
│   │   ├── Artist.jsx           # Detalhes do artista
│   │   └── Artists.jsx          # Lista de artistas
│   ├── components/
│   │   ├── Player.jsx           # Player de áudio
│   │   ├── SongItem.jsx         # Item de música na lista
│   │   ├── Header.jsx           # Header verde Spotify
│   │   ├── Main.jsx             # Conteúdo principal
│   │   ├── ItemList.jsx         # Lista horizontal de artistas
│   │   └── SingleItem.jsx       # Card de artista
│   ├── navigation/
│   │   └── AppNavigator.jsx     # Navegação entre telas
│   ├── assets/
│   │   └── database/            # Dados locais de fallback
│   ├── App.js                   # Entry point
│   └── main.jsx                 # React DOM entry (web)
├── package.json
├── .env.example                 # Template de variáveis de ambiente
├── .env.local                   # Suas credenciais (não commitir!)
└── app.json                     # Configuração Expo

```

## 🎯 Como Funciona

### 1. Autenticação (spotifyAuth.js)

- Usa **Client Credentials Flow** do Spotify
- Troca Client ID + Secret por um access token
- Token é cacheado e renovado automaticamente

### 2. Busca de Dados (spotifyApi.js)

Funções disponíveis:
- `searchTracks(query)` - Busca músicas
- `getNewReleases()` - Lançamentos novos
- `getTopTracks()` - Tracks populares
- `getPlaylistTracks(playlistId)` - Músicas de playlist
- `getArtist(artistId)` - Info do artista
- `getArtistTopTracks(artistId)` - Top tracks do artista

### 3. Reprodução (Player.jsx + Song.jsx)

- Usa **expo-av** para reproduzir áudio
- Preview URLs do Spotify (15-30 segundos)
- Botão Play/Pause com estado sincronizado

## 🛠️ Troubleshooting

### "Spotify Client ID not configured"

✅ Verifique se `.env.local` existe e tem valores corretos
✅ Reinicie o Expo (Ctrl+C e `npm start` novamente)
✅ Limpe o cache: `expo start -c`

### "Spotify auth failed"

✅ Verifique Client ID e Secret no Spotify Dashboard
✅ Confirme que a app foi criada corretamente
✅ Tente gerar um novo Client Secret

### Áudio não toca

✅ Preview URLs têm limite de 30 segundos
✅ Verifique permissões de áudio no Android
✅ Teste com `http://localhost:8081` no navegador primeiro

### CORS error

✅ Problema no web (navegador)
✅ Use Expo dev server ao invés de localhost direto
✅ Spotify API aceita CORS quando token é válido

## 📦 Dependências Principais

```json
{
  "react": "19.1.0",
  "react-native": "0.81.5",
  "expo": "54.0.0",
  "expo-av": "~16.0.0",
  "react-navigation": "6.1.6"
}
```

## 🚀 Próximos Passos

- [ ] Adicionar search bar para buscar músicas
- [ ] Implementar playlist creation
- [ ] Adicionar favoritos/likes
- [ ] Melhorar Player UI (seek bar, volume)
- [ ] Cache de dados com AsyncStorage
- [ ] Dark mode / theming
- [ ] Testes automatizados (Jest)

## 📝 Notas Importantes

- Spotify Web API preview URLs têm limite de 15-30 segundos
- Client Credentials Flow NÃO permite acesso a dados pessoais do usuário
- Para playlist pessoal/biblioteca, use Authorization Code Flow (mais complexo)
- Sempre mantenha Client Secret seguro - não publique online!

## 🤝 Suporte

Documentação oficial:
- Spotify Web API: https://developer.spotify.com/documentation/web-api/
- Expo AV: https://docs.expo.dev/modules/expo-av/
- React Navigation: https://reactnavigation.org/

---

**Desenvolvido com ❤️ usando React Native + Expo**
