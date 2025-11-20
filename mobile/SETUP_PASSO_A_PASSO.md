# 🎵 Configurar Spotify API - Passo a Passo

## 📋 O Que Você Vai Fazer

1. Criar uma app no Spotify Developer
2. Copiar Client ID e Secret
3. Adicionar ao `app.json`
4. Reiniciar o app

**Tempo estimado: 5 minutos** ⏱️

---

## ✅ PASSO 1: Acessar Spotify Developer Dashboard

**URL:** https://developer.spotify.com/dashboard

1. Clique em **Sign up** (se não tiver conta)
2. Login com seu email
3. Confirme a conta no email

---

## ✅ PASSO 2: Criar uma Nova App

1. No dashboard, clique em **"Create an App"**
2. Digite um nome (ex: "Spotify Mobile App")
3. Concorde com os termos ✓
4. Clique em **"Create"**

---

## ✅ PASSO 3: Copiar Credenciais

Após criar a app, você verá uma página com:

```
Client ID:     abc123def456ghi789jkl012
Client Secret: xyz987uvw654rst321opq098
```

**COPIE ESTES VALORES!** 🔐

---

## ✅ PASSO 4: Abrir `app.json`

Abra o arquivo:
```
/home/lucasbastos/Spotify_App/Spotify/mobile/app.json
```

---

## ✅ PASSO 5: Adicionar Credenciais

Encontre a seção `"extra"`:

```json
{
  "expo": {
    "name": "Spotify Mobile",
    "slug": "spotify-mobile",
    "platforms": ["ios", "android", "web"],
    "version": "1.0.0",
    "orientation": "portrait",
    "extra": {
      "SPOTIFY_CLIENT_ID": "seu_client_id_aqui",
      "SPOTIFY_CLIENT_SECRET": "seu_client_secret_aqui"
    }
  }
}
```

**SUBSTITUA:**
- `seu_client_id_aqui` → Cole seu **Client ID**
- `seu_client_secret_aqui` → Cole seu **Client Secret**

---

## ✅ PASSO 6: Configurar Redirect URIs (Importante!)

1. Volte ao **Spotify Developer Dashboard**
2. Clique em sua app
3. Clique em **"Edit Settings"**
4. Procure por **"Redirect URIs"**
5. Clique em **"Add a Redirect URI"**

**Adicione estas URIs:**

### Para Web (Desktop):
```
http://localhost:19006
http://localhost:3000/callback
http://192.168.1.68:19006/callback
http://192.168.1.68:3000/callback
```

### Para Mobile (Android/iOS):
```
exp://localhost:8081
exp://192.168.1.68:8081
```

6. Clique em **"Save"**

---

## ✅ PASSO 7: Reiniciar o App

Execute no terminal:

```bash
# Parar o app atual
pkill -9 -f "expo"

# Ir para a pasta certa
cd /home/lucasbastos/Spotify_App/Spotify/mobile

# Reiniciar
npx expo start
```

---

## ✅ VERIFICAR SE FUNCIONOU

Você deve ver no console:

```
✅ LOG [Home] Fetching from Spotify API...
✅ Web Bundled 89ms
✅ Android Bundled 4178ms
```

**Sem mensagens de erro sobre Client ID!** 🎉

---

## 🐛 TROUBLESHOOTING

### Erro: "Client ID not configured"

**Solução:**
1. Verifique se `app.json` tem os valores corretos (sem placeholder!)
2. Verifique se não há espaços extras
3. Reinicie completamente:
   ```bash
   pkill -9 -f "expo\|metro"
   sleep 2
   cd /home/lucasbastos/Spotify_App/Spotify/mobile
   npx expo start
   ```

### Erro: "Network request failed"

**Solução:**
1. Verifique sua internet
2. Certifique-se de ter adicionado os Redirect URIs
3. Aguarde 1-2 minutos (Spotify pode levar tempo para atualizar)

### Erro: "Unauthorized"

**Solução:**
1. Copie exatamente o Client Secret (sem espaços)
2. Verifique se a app está ativa no dashboard
3. Tente recriar a app (Delete e Create novamente)

---

## 📝 ARQUIVO ANTES E DEPOIS

### ANTES (❌ Não funciona):
```json
"extra": {
  "SPOTIFY_CLIENT_ID": "your_client_id_here",
  "SPOTIFY_CLIENT_SECRET": "your_client_secret_here"
}
```

### DEPOIS (✅ Funciona):
```json
"extra": {
  "SPOTIFY_CLIENT_ID": "4h0viu9obzchae7f30kqb6n9",
  "SPOTIFY_CLIENT_SECRET": "a1b2c3d4e5f6g7h8i9j0k1l2"
}
```

---

## ✅ PRÓXIMOS PASSOS

Após configurar com sucesso:

1. **Testar Search** → Vá na Home, procure por uma música
2. **Testar Login** → Clique em "Login", faça login no Spotify
3. **Testar Playlist** → Crie uma playlist
4. **Testar Player** → Toque uma música

---

## 🔐 SEGURANÇA

⚠️ **IMPORTANTE:**

- `app.json` pode ser commitado no Git (credenciais não são sensíveis aqui, apenas para público)
- Para produção, use **eas.json** do Expo (configuração segura)
- **NUNCA** compartilhe seu Client Secret com ninguém
- Regenere o secret se achar que foi comprometido

---

## 📞 DÚVIDAS?

Verifique estes arquivos também:
- `SPOTIFY_SETUP.md` - Setup completo
- `USER_AUTH_SETUP.md` - Setup de autenticação do usuário
- `SPOTIFY_EXAMPLES.js` - Exemplos de código

---

**Tudo certo? Bora usar a Spotify API! 🚀**
