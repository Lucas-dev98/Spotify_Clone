# ⚙️ Configurar Credenciais do Spotify

## 🚀 Passo 1: Criar App no Spotify Developer Dashboard

1. Acesse: **https://developer.spotify.com/dashboard**
2. Login com sua conta Spotify (crie uma se não tiver)
3. Clique em **"Create an App"**
4. Marque as checkboxes de termos
5. Clique em **"Create"**

## 📋 Passo 2: Aceitar Termos

Uma tela aparecerá pedindo para aceitar os termos. Leia e aceite.

## 🔑 Passo 3: Copiar Credentials

Após criar a app, você verá uma página com:
- **Client ID** - Copie isto
- **Client Secret** - Copie isto (SEGREDO! Nunca compartilhe)

## 📝 Passo 4: Configurar `.env.local`

Abra o arquivo `/home/lucasbastos/Spotify_App/Spotify/mobile/.env.local` e substitua:

```dotenv
# Antes:
REACT_APP_SPOTIFY_CLIENT_ID=your_client_id_here
REACT_APP_SPOTIFY_CLIENT_SECRET=your_client_secret_here

# Depois (com suas credenciais):
REACT_APP_SPOTIFY_CLIENT_ID=abc123def456ghi789jkl012
REACT_APP_SPOTIFY_CLIENT_SECRET=xyz987uvw654rst321opq098
```

## 🔗 Passo 5: Configurar Redirect URI (Importante!)

1. No Spotify Dashboard, acesse sua app criada
2. Clique em **"Edit Settings"**
3. Procure por **"Redirect URIs"**
4. Clique em **"Add a redirect URI"**
5. Para **Web**, adicione:
   ```
   http://localhost:3000/callback
   http://192.168.1.68:19006/callback
   ```
6. Para **Mobile/Expo**, adicione:
   ```
   exp://localhost:8081
   exp://192.168.1.68:8081
   ```
7. Clique em **"Save"**

## ✅ Verificar se Funcionou

Após configurar, reinicie o app:

```bash
# Parar o app
pkill -9 -f "expo"

# Reiniciar
cd /home/lucasbastos/Spotify_App/Spotify/mobile
npx expo start
```

Se tudo estiver correto, você verá:

```
✅ LOG  [Home] Fetching from Spotify API...
✅ Músicas carregadas do Spotify
```

Não mais mensagens de erro sobre credenciais!

## 🐛 Se ainda receber erros

1. **Verificar `.env.local`**:
   - Client ID e Secret estão corretos?
   - Sem espaços extras?
   - Sem caracteres especiais?

2. **Reiniciar Completamente**:
   ```bash
   pkill -9 -f "expo\|metro"
   cd /home/lucasbastos/Spotify_App/Spotify/mobile
   npm install
   npx expo start
   ```

3. **Limpar Cache**:
   ```bash
   rm -rf .expo
   rm -rf node_modules/.expo
   ```

## 🔐 IMPORTANTE: SEGURANÇA

⚠️ **NUNCA** commita `.env.local` no Git!

O arquivo `.gitignore` já protege isto, mas verifique:

```bash
cat .gitignore | grep .env
# Deve mostrar: .env.local
```

## 📞 Suporte

Se ainda tiver dúvidas:

1. Verifique se está logado na conta certa do Spotify
2. Verifique se a app foi criada corretamente
3. Rode `npm install` novamente
4. Reinicie o computador se necessário

---

**Pronto?** Agora você pode usar a Spotify API! 🎵
