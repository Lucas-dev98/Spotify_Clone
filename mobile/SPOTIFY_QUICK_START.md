# 🚀 Começar com Spotify API - Guia Rápido

## 1️⃣ Obter Credenciais (5 minutos)

```bash
# Abra no navegador:
https://developer.spotify.com/dashboard

# 1. Faça login (ou crie conta)
# 2. Clique "Create an App"
# 3. Preencha o nome (ex: "Spotify Mobile")
# 4. Aceite os termos
# 5. Clique "Create"
# 6. Na página da app:
#    - Copie o "Client ID"
#    - Clique "Show Client Secret" e copie
```

## 2️⃣ Configurar o Projeto

```bash
# 1. Copie o arquivo de template
cd /home/lucasbastos/Spotify_App/Spotify/mobile
cp .env.example .env.local

# 2. Edite .env.local com seu editor favorito
nano .env.local
# (ou abra no VS Code)

# Cole seus valores:
# REACT_APP_SPOTIFY_CLIENT_ID=SEU_CLIENT_ID
# REACT_APP_SPOTIFY_CLIENT_SECRET=SEU_CLIENT_SECRET

# Salve e feche (Ctrl+X, Y, Enter no nano)
```

## 3️⃣ Instalar Dependências

```bash
cd /home/lucasbastos/Spotify_App/Spotify/mobile
npm install --legacy-peer-deps
```

## 4️⃣ Iniciar o App

### Opção A: Testar no Navegador (mais rápido)

```bash
# Terminal na pasta mobile/
npm start

# Pressione 'w' quando a mensagem aparecer
# Abrirá em http://localhost:8081
```

### Opção B: Testar no Emulador Android

```bash
# Terminal 1 - Inicie o Expo
cd mobile
npm start

# Pressione 'a' quando mensagem aparecer
# (ou use 'adb devices' antes para confirmar emulador)
```

## 5️⃣ Validar que Funciona

Quando a app abrir:

✅ **Deve mostrar:**
- Header verde "Spotify"
- "Conectando ao Spotify..." durante carregamento
- Lista de artistas e músicas
- Pode clicar em qualquer música para abrir detalhes

✅ **Na página da música deve:**
- Mostrar imagem
- Mostrar nome, artista, duração
- Mostrar Player com botão "Play"
- Conseguir tocar o áudio

## 🆘 Troubleshooting

### ❌ "Spotify Client ID not configured"

```bash
# Verifique que .env.local existe:
ls -la .env.local

# Verifique conteúdo:
cat .env.local

# Se faltando valores, edite:
nano .env.local

# Depois reinicie:
# Ctrl+C no Expo
# npm start
# Pressione 'c' para limpar cache
```

### ❌ "Spotify auth failed"

```bash
# 1. Verifique credenciais no Spotify Dashboard
#    https://developer.spotify.com/dashboard

# 2. Se acabou de criar a app, espere 1 minuto

# 3. Tente gerar novo Client Secret:
#    - Vá em Settings da app
#    - Clique "Show Client Secret"
#    - Copie o novo
#    - Atualize .env.local
```

### ❌ Áudio não toca

Spotify preview URLs têm limite de 30 segundos - isso é esperado!

## 📊 Testar API Manualmente

Se quiser testar a API sem toda a interface:

```bash
# Vá para o arquivo
mobile/src/components/SpotifyDebug.jsx

# Abra em uma aba nova no navegador
# Clique "Test Auth" para verificar credenciais
# Clique "Test Search" para buscar músicas
# Clique "Test Releases" para pegar novos lançamentos
```

## 📁 Estrutura do Projeto

```
mobile/
├── .env.local                   ← AQUI SEUS SECRETS (não commitir!)
├── .env.example                 ← Template (versão segura)
├── src/
│   ├── services/
│   │   ├── spotifyAuth.js       ← Autentica com Spotify
│   │   └── spotifyApi.js        ← Busca músicas/artistas
│   ├── config/
│   │   └── spotifyConfig.js     ← Config Spotify
│   ├── pages/
│   │   ├── Home.jsx             ← NOVA - usa Spotify API
│   │   └── Song.jsx             ← Player + detalhes
│   └── components/
│       ├── Player.jsx           ← Toca o áudio
│       └── SpotifyDebug.jsx     ← Para testar
├── App.js
└── package.json
```

## ✅ Checklist Final

- [ ] Criei app no Spotify Developer Dashboard
- [ ] Copiei Client ID e Client Secret
- [ ] Criei arquivo `.env.local` com valores
- [ ] Rodei `npm install --legacy-peer-deps`
- [ ] Rodei `npm start`
- [ ] Abri app no navegador ou emulador
- [ ] Consigo ver músicas e artistas
- [ ] Consigo tocar uma música

## 🎉 Pronto!

Sua app React Native agora está conectada à Spotify! 

**Próximos passos:**
- Explore as funções em `spotifyApi.js`
- Personalize as buscas (gêneros, artistas específicos, etc)
- Adicione search bar na UI
- Implemente salvamento de favoritos

---

**Dúvidas?** Consulte:
- Spotify Web API: https://developer.spotify.com/documentation/web-api/
- Expo Documentation: https://docs.expo.dev/
