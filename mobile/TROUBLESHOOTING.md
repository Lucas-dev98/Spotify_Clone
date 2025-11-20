# 🔧 Guia de Troubleshooting - Spotify API

## ❌ Erro: "Spotify Client ID not configured"

### Causa
O arquivo `.env.local` não foi criado ou não tem valores

### Solução

```bash
# 1. Verifique se o arquivo existe
ls -la .env.local

# 2. Se não existe, crie:
cp .env.example .env.local

# 3. Abra e edite com seus valores:
nano .env.local
# ou no VS Code:
code .env.local

# 4. Salve e reinicie Expo:
# Pressione Ctrl+C no Expo
# npm start
# Pressione 'c' para limpar cache
```

### Verificar Conteúdo
```bash
cat .env.local
# Deve mostrar:
# REACT_APP_SPOTIFY_CLIENT_ID=seu_id_aqui
# REACT_APP_SPOTIFY_CLIENT_SECRET=seu_secret_aqui
```

---

## ❌ Erro: "Spotify auth failed: 400 Bad Request"

### Causas Possíveis
1. Client ID ou Secret inválidos
2. Caracteres especiais no secret
3. Espaços em branco no .env.local

### Solução

```bash
# 1. Verifique formato do .env.local
cat .env.local

# Deve ser:
REACT_APP_SPOTIFY_CLIENT_ID=abc123xyz
REACT_APP_SPOTIFY_CLIENT_SECRET=def456uvw
# NÃO deve ter aspas ou espaços

# 2. Regenere credenciais no Spotify Dashboard:
# https://developer.spotify.com/dashboard
# - Clique na sua app
# - Settings
# - Client Secret: clique "Show Client Secret"
# - Copie novo valor (sem espaços!)
# - Atualize .env.local

# 3. Teste com curl:
curl -X POST https://accounts.spotify.com/api/token \
  -H "Authorization: Basic $(echo -n 'your_client_id:your_client_secret' | base64)" \
  -d "grant_type=client_credentials"

# Deve retornar JSON com "access_token"
```

---

## ❌ Erro: "CORS error" (no navegador/web)

### Causa
Navegador bloqueando requisições cross-origin para Spotify API

### Não é Problema!
✅ Isso é NORMAL em development
✅ Spotify API funciona normalmente via Expo
✅ A app funcionará em mobile sem problema

### Solução para Web
Nada a fazer - a implementação já trata isso:
- ✅ Requests vêm do Expo dev server
- ✅ Expo gerencia CORS automaticamente
- ✅ Spotify API retorna dados normalmente

---

## ❌ Erro: "Failed to fetch from Spotify API, using local data"

### Causa
Conexão com Spotify API falhou (temporária)

### Verificar

```bash
# 1. Teste se Spotify API está acessível:
curl -H "Authorization: Bearer test" https://api.spotify.com/v1/search?q=test

# 2. Verifique credenciais de novo:
cat .env.local

# 3. Teste auth manualmente:
# Se a app tiver SpotifyDebug component:
# - Abra app no navegador
# - Clique "Test Auth"
# - Deve mostrar token se credenciais corretas

# 4. Verifique internet:
ping google.com
```

### Fallback Funcionando
Isso é OK! Quando Spotify API falha:
✅ App automaticamente usa dados locais
✅ Mensagem "Aviso" mostra no app
✅ Funcionalidade continua
✅ Próxima recarga tenta Spotify novamente

---

## ❌ Erro: "Áudio não toca" ou "Preview URL inválida"

### Causas
1. Preview URL expirou
2. Sem permissões de áudio
3. URL quebrada

### Solução

```bash
# 1. Verifique se é preview (limitado a 30s):
# Isso é NORMAL - preview URLs do Spotify têm limite
# ✅ Esperado: áudio toca por ~15-30 segundos

# 2. Verifique permissões Android:
# No app.json, verifique:
{
  "plugins": [
    ["expo-av", {
      "microphonePermission": "Allow app to access your microphone?"
    }]
  ]
}

# 3. Se em emulador Android, verifique:
# Settings > Apps > YourApp > Permissions > Audio
# Deve estar habilitado

# 4. Teste no componente SpotifyDebug:
# - Clique "Test Search"
# - Veja se audio URLs aparecem
# - Tente copiar URL e abrir no navegador
```

---

## ❌ Erro: "Module not found: spotifyApi"

### Causa
Arquivo criado mas não no lugar certo

### Solução

```bash
# 1. Verifique estrutura:
ls -la src/services/
# Deve ter:
# - spotifyAuth.js
# - spotifyApi.js

# 2. Se estão em outro lugar:
# Mova para src/services/
mv spotifyApi.js mobile/src/services/

# 3. Verifique imports em Home.jsx:
grep "from.*spotifyApi" src/pages/Home.jsx

# Deve estar:
# import { getNewReleases, searchTracks } from '../services/spotifyApi';

# 4. Reinicie Expo:
# Ctrl+C no terminal
# npm start
# Pressione 'c'
```

---

## ❌ Erro: "require.resolve is not a function" ou build error

### Causa
Versão de dependência incompatível

### Solução

```bash
# 1. Limpe tudo:
rm -rf node_modules package-lock.json

# 2. Reinstale:
npm install --legacy-peer-deps

# 3. Limpe cache Expo:
npm start -c

# 4. Se persistir:
npm start -- --clear
```

---

## ❌ Erro: ".env.local não é lido"

### Causa
Expo começou antes do arquivo existir

### Solução

```bash
# 1. Se Expo já estava rodando:
# Pressione Ctrl+C para parar

# 2. Crie/edite .env.local

# 3. Reinicie:
npm start

# 4. Pressione 'c' para limpar cache (importante!)

# 5. Pressione 'w' ou 'a' para ver as mudanças
```

---

## ⚠️ Aviso: "Spotify Client Secret not configured"

### Significado
Secret não foi configurado ou está inválido

### Solução

```bash
# Mesmo que "Client ID not configured"
# Verifique .env.local:
cat .env.local

# Ambas linhas devem estar com valores:
REACT_APP_SPOTIFY_CLIENT_ID=valor_aqui
REACT_APP_SPOTIFY_CLIENT_SECRET=valor_aqui
```

---

## 🔍 Como Debugar

### 1. Verificar Logs
```bash
# Terminal com Expo rodando:
# Pressione 'l' para mostrar logs
# Procure por:
# - "[Home]" = logs da Home page
# - "Spotify token" = autenticação funcionou
# - "Spotify API error" = erro na API
```

### 2. Usar SpotifyDebug Component
```bash
# Se criou o componente SpotifyDebug.jsx:
# 1. Importe em App.js:
import SpotifyDebug from './src/components/SpotifyDebug';

# 2. Mostre temporariamente:
<SpotifyDebug />

# 3. Teste cada botão:
# - Test Auth → deve passar
# - Test Search → deve retornar tracks
# - Test Releases → deve retornar albums
```

### 3. Verificar Network (Web)
```bash
# Abra Developer Tools (F12)
# Aba "Network"
# Procure por:
# - accounts.spotify.com/api/token → POST 200 OK
# - api.spotify.com/v1/... → GET 200 OK
# Se for 401/403 → credenciais inválidas
# Se for 429 → rate limited (espere)
```

### 4. Verificar .env.local
```bash
# Sempre verifique:
cat .env.local

# Procure por:
# ✅ REACT_APP_SPOTIFY_CLIENT_ID=...
# ✅ REACT_APP_SPOTIFY_CLIENT_SECRET=...
# ❌ SEM aspas
# ❌ SEM espaços antes/depois
# ❌ SEM comentários na mesma linha
```

---

## ✅ Checklist para Funcionar

- [ ] Criei app no Spotify Developer Dashboard
- [ ] Copiei Client ID (sem espaços)
- [ ] Copiei Client Secret (sem espaços)
- [ ] Criei .env.local (não .env!)
- [ ] Adicionei valores no .env.local
- [ ] Rodei `npm install --legacy-peer-deps`
- [ ] Parei Expo e reiniciei com cache limpo (`npm start -c`)
- [ ] Pressione 'c' após selecionar w/a
- [ ] App mostra "Conectando ao Spotify..."
- [ ] Aparecem artistas/músicas (não vazio)
- [ ] Consigo clicar em música e abrir detalhes
- [ ] Botão Play aparece no detalhe da música

Se tudo acima está ✅ → Spotify API funcionando! 🎉

---

## 📞 Suporte Adicional

Se o erro persistir:

1. **Limpe tudo**
```bash
# Pasta mobile/
rm -rf node_modules .expo
npm install --legacy-peer-deps
npm start -c
```

2. **Verifique credenciais novamente**
```bash
# Spotify Dashboard:
# https://developer.spotify.com/dashboard
# Verifique se app ainda existe
# Regenere secrets se necessário
```

3. **Consulte a documentação oficial**
- Spotify Web API: https://developer.spotify.com/documentation/web-api/
- Expo Docs: https://docs.expo.dev/
- React Native: https://reactnative.dev/

4. **Verifique se pode fazer curl**
```bash
# Se conseguir fazer isso, tá tudo bem:
curl -X POST https://accounts.spotify.com/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Basic $(echo -n 'CLIENT_ID:CLIENT_SECRET' | base64)" \
  -d "grant_type=client_credentials"

# Deve retornar JSON com access_token
```

---

**Última atualização:** Nov 2025
**Versões Testadas:**
- React: 19.1.0
- React Native: 0.81.5
- Expo: 54.0.0
- expo-av: 16.0.0
