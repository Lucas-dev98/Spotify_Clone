# 🚀 SETUP RÁPIDO - 3 Passos

## Passo 1: Obter Credenciais

1. Acesse: https://developer.spotify.com/dashboard
2. Login / Sign up
3. Clique "Create an App"
4. Aceite os termos
5. **COPIE**: Client ID e Client Secret

## Passo 2: Adicionar ao app.json

Abra: `/home/lucasbastos/Spotify_App/Spotify/mobile/app.json`

Encontre:
```json
"extra": {
  "SPOTIFY_CLIENT_ID": "your_client_id_here",
  "SPOTIFY_CLIENT_SECRET": "your_client_secret_here"
}
```

Substitua pelos seus valores:
```json
"extra": {
  "SPOTIFY_CLIENT_ID": "4h0viu9obzchae7f30kqb6n9",
  "SPOTIFY_CLIENT_SECRET": "a1b2c3d4e5f6g7h8i9j0k1l2"
}
```

## Passo 3: Reiniciar

```bash
pkill -9 -f "expo"
cd /home/lucasbastos/Spotify_App/Spotify/mobile
npx expo start
```

## ✅ Pronto!

Abra no navegador: http://localhost:19006 ou escanear QR code

---

## 📌 Configuração Extra (Optional)

Se quiser usar Login do Spotify (user auth), também precisa configurar:

1. No Spotify Dashboard, vá em "Edit Settings"
2. Em "Redirect URIs", adicione:
   - `http://localhost:19006/callback`
   - `exp://localhost:8081`
   - `exp://192.168.1.68:8081`
3. Salve

---

## ✨ Mais Informações

- `SETUP_PASSO_A_PASSO.md` - Guia completo (imagens/screenshots)
- `SPOTIFY_SETUP.md` - Documentação técnica
- `USER_AUTH_SETUP.md` - Para login de usuário
- `TROUBLESHOOTING.md` - Resolver problemas

---

**Dúvidas? Procure nos arquivos `.md` da pasta!** 📚
