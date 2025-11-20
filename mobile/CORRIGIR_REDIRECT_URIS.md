# 🎯 Configurar Redirect URIs - Guia Rápido

## ⚠️ PROBLEMA ENCONTRADO

Seu Redirect URI está com typo:
```
❌ http://localhost:190006  ← ERRADO (3 zeros!)
✅ http://localhost:19006   ← CERTO (2 zeros!)
```

---

## ✅ PASSO 1: Corrigir Redirect URIs

1. Vá em: https://developer.spotify.com/dashboard
2. Clique na app: **"mySpotify"**
3. Clique em: **"Edit Settings"**
4. Procure por: **"Redirect URIs"**

5. **REMOVA:**
   - ❌ `http://localhost:190006` (typo)

6. **ADICIONE ESTAS:**
   ```
   http://localhost:19006
   http://localhost:3000/callback
   exp://localhost:8081
   exp://192.168.1.68:8081
   ```

7. Clique: **"Save"**

**Resultado esperado:**
```
✅ Redirect URIs adicionadas com sucesso!
```

---

## ✅ PASSO 2: Copiar Client ID

Na página da sua app, você vê:
```
Client ID: 031e7c3ae27041cc8e930273af160b87
```

**COPIE ESTE VALOR!** 🔐

---

## ✅ PASSO 3: Adicionar em app.json

Abra: `/home/lucasbastos/Spotify_App/Spotify/mobile/app.json`

Encontre:
```json
"extra": {
  "SPOTIFY_CLIENT_ID": "your_client_id_here",
  "SPOTIFY_CLIENT_SECRET": "your_client_secret_here"
}
```

Substitua o Client ID:
```json
"extra": {
  "SPOTIFY_CLIENT_ID": "031e7c3ae27041cc8e930273af160b87",
  "SPOTIFY_CLIENT_SECRET": "your_client_secret_here"
}
```

Salve (Ctrl+S)

---

## ⚠️ FALTA: Client Secret

Você ainda precisa do **Client Secret**!

Na página da app no Spotify Dashboard:

1. Procure por: **"Client Secret"**
   - Pode estar escondido (click para revelar)
   - Texto: "Show Client Secret" ou similar

2. **COPIE o valor**

3. Adicione em app.json:
```json
"SPOTIFY_CLIENT_SECRET": "seu_secret_aqui"
```

---

## 🚀 PRÓXIMO PASSO

Após adicionar Client ID e Secret em `app.json`:

```bash
pkill -9 -f "expo"
cd /home/lucasbastos/Spotify_App/Spotify/mobile
npx expo start
```

Abra: http://localhost:19006

**PRONTO! Spotify API funcionando! ✅**

---

## 🔍 VERIFICAÇÃO

No console do navegador (F12), procure por:

```
✅ RESULTADOS DA VERIFICAÇÃO
✅ ✅ Expo Constants [OK]
✅ ✅ Spotify Config [OK]
```

Se tiver ✅ em tudo = **Sucesso!** 🎉

---

## ⚠️ Se Receber Erro

### "Invalid redirect URI"
- Verifique se digitou correto (19006, não 190006)
- Aguarde 1-2 minutos para Spotify atualizar

### "Client Secret not found"
- Na página da app, clique em "Show Client Secret"
- Copie o valor

### "Client ID not configured"
- Verifique se adicionou em app.json
- Verifique se não há espaços extras
- Reinicie: `npx expo start` (Ctrl+R)

---

**Continue no próximo passo! 🚀**
