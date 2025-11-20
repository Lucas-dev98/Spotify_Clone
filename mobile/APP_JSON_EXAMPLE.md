# Exemplo: app.json Completo com Credenciais

## ❌ ANTES (Não funciona)

```json
{
  "expo": {
    "name": "Spotify Mobile",
    "slug": "spotify-mobile",
    "platforms": [
      "ios",
      "android",
      "web"
    ],
    "version": "1.0.0",
    "orientation": "portrait",
    "android": {
      "package": "com.lucasoliverb98.spotifymobile"
    },
    "ios": {
      "supportsTabletMode": true
    },
    "extra": {
      "SPOTIFY_CLIENT_ID": "your_client_id_here",
      "SPOTIFY_CLIENT_SECRET": "your_client_secret_here"
    }
  }
}
```

**Resultado:**
```
❌ WARN  Spotify Client ID not configured
❌ WARN  Spotify Client Secret not configured
❌ ERROR Spotify API request failed
```

---

## ✅ DEPOIS (Funciona!)

```json
{
  "expo": {
    "name": "Spotify Mobile",
    "slug": "spotify-mobile",
    "platforms": [
      "ios",
      "android",
      "web"
    ],
    "version": "1.0.0",
    "orientation": "portrait",
    "android": {
      "package": "com.lucasoliverb98.spotifymobile"
    },
    "ios": {
      "supportsTabletMode": true
    },
    "extra": {
      "SPOTIFY_CLIENT_ID": "4h0viu9obzchae7f30kqb6n9",
      "SPOTIFY_CLIENT_SECRET": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8"
    }
  }
}
```

**Resultado:**
```
✅ LOG  [Home] Fetching from Spotify API...
✅ Web Bundled 89ms
✅ Android Bundled 4178ms
✅ Spotify API response: [...200 items...]
```

---

## 🔍 Onde copiar o Client ID e Secret

1. Vá em: https://developer.spotify.com/dashboard
2. Clique na app que criou
3. Veja a página com:

```
App Name: Spotify Mobile
Client ID: 4h0viu9obzchae7f30kqb6n9 ← COPIA ISTO
Client Secret: a1b2c3d4e5... ← COPIA ISTO
```

3. Cole em `app.json` na seção `"extra"`

---

## ⚠️ Cuidados

### ✅ Você PODE fazer:
- Editar `app.json` localmente
- Commitar com valores reais (em Expo public, it's ok)
- Compartilhar Client ID publicamente

### ❌ NUNCA faça:
- Compartilhar Client Secret com ninguém
- Usar Client Secret no frontend (use apenas Client ID)
- Commitar credenciais em git (especialmente se privado)

---

## 📝 Estrutura do JSON

O JSON deve ter exatamente:

```
{
  "expo": {                    ← Principal
    "name": "...",             ← Nome do app
    "slug": "...",             ← ID único
    "platforms": [...],        ← Plataformas (ios, android, web)
    "version": "1.0.0",        ← Versão
    "orientation": "portrait", ← Orientação
    "android": {...},          ← Configurações Android
    "ios": {...},              ← Configurações iOS
    "extra": {                 ← NOSSA SEÇÃO
      "SPOTIFY_CLIENT_ID": "...",
      "SPOTIFY_CLIENT_SECRET": "..."
    }
  }
}
```

---

## ✨ Próxima Etapa

Após adicionar as credenciais em `app.json`:

1. Salvar o arquivo (Ctrl+S)
2. Recarregar o app (Ctrl+R no console Expo)
3. Verificar console para confirmar

Se ainda tiver erro, veja:
- `TROUBLESHOOTING.md` - Soluções de problemas
- `SETUP_PASSO_A_PASSO.md` - Guia visual completo

---

**Dúvida? Procure nos arquivos `.md`! 📚**
