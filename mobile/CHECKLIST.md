# ✅ CHECKLIST - Configurar Spotify API

## ANTES DE COMEÇAR

- [ ] Você tem internet
- [ ] Você tem uma conta Spotify (ou vai criar)
- [ ] Você tem acesso ao terminal
- [ ] Você tem o editor aberto

---

## ETAPA 1: Criar App no Spotify

- [ ] Abra: https://developer.spotify.com/dashboard
- [ ] Clique em "Sign Up" se não tiver conta
- [ ] Faça login
- [ ] Clique em "Create an App"
- [ ] Digite um nome (ex: "Spotify Mobile App")
- [ ] Marque as checkboxes dos termos
- [ ] Clique em "Create"
- [ ] Aceite os termos novamente (se solicitado)

**Tempo:** ~2 minutos

---

## ETAPA 2: Copiar Credenciais

Na página da app que criou:

- [ ] Procure por "Client ID"
- [ ] **COPIE** o valor (ex: 4h0viu9obzchae7f30kqb6n9)
- [ ] Procure por "Client Secret"
- [ ] **COPIE** o valor (ex: a1b2c3d4e5f6g7h8i9j0k1l2)

**Importante:** Guarde em um bloco de notas temporário!

**Tempo:** ~30 segundos

---

## ETAPA 3: Configurar app.json

- [ ] Abra o arquivo: `/home/lucasbastos/Spotify_App/Spotify/mobile/app.json`
- [ ] Procure por: `"extra": {`
- [ ] Dentro de extra, encontre:
  ```
  "SPOTIFY_CLIENT_ID": "your_client_id_here",
  "SPOTIFY_CLIENT_SECRET": "your_client_secret_here"
  ```
- [ ] Substitua `your_client_id_here` pelo seu Client ID
- [ ] Substitua `your_client_secret_here` pelo seu Client Secret
- [ ] **Exemplo do resultado:**
  ```json
  "extra": {
    "SPOTIFY_CLIENT_ID": "4h0viu9obzchae7f30kqb6n9",
    "SPOTIFY_CLIENT_SECRET": "a1b2c3d4e5f6g7h8i9j0k1l2"
  }
  ```
- [ ] Salve o arquivo (Ctrl+S)

**Tempo:** ~1 minuto

---

## ETAPA 4: Configurar Redirect URIs (Opcional mas Recomendado)

- [ ] Volte ao Spotify Developer Dashboard
- [ ] Clique na sua app
- [ ] Clique em "Edit Settings"
- [ ] Procure por "Redirect URIs"
- [ ] Clique em "Add a Redirect URI"
- [ ] Adicione estas URIs:
  ```
  http://localhost:19006
  http://localhost:3000/callback
  exp://localhost:8081
  exp://192.168.1.68:8081
  ```
- [ ] Clique "Save"

**Tempo:** ~1 minuto

---

## ETAPA 5: Reiniciar o App

No terminal:

```bash
# 1. Parar o app (se estiver rodando)
pkill -9 -f "expo"

# 2. Aguardar 2 segundos
sleep 2

# 3. Ir para a pasta
cd /home/lucasbastos/Spotify_App/Spotify/mobile

# 4. Iniciar
npx expo start
```

- [ ] Paste e execute os comandos acima
- [ ] Aguarde ~5-10 segundos para compilar

**Tempo:** ~30 segundos

---

## ETAPA 6: Verificar se Funcionou

- [ ] Abra seu navegador
- [ ] Vá em: http://localhost:19006 (ou escanear QR code)
- [ ] Abra o console (F12 ou Cmd+Option+I)
- [ ] Procure por "RESULTADOS DA VERIFICAÇÃO"
- [ ] Verifique se tem muitos ✅

**Esperado:**
```
✅ ✅ Expo Constants [OK]
✅ ✅ Spotify Config [OK]
✅ TUDO CONFIGURADO! Spotify API deve funcionar.
```

**Problema?** Se vir muitos ❌, algo não está certo. Veja TROUBLESHOOTING.md

**Tempo:** ~30 segundos

---

## ETAPA 7: Testar

- [ ] Na app, vá para Home
- [ ] Procure por uma música (ex: "Imagine")
- [ ] Deve aparecer resultados do Spotify

**Esperado:**
```
✅ LOG [Home] Fetching from Spotify API...
✅ [Música 1]
✅ [Música 2]
✅ [Música 3]
```

**Problema?** Se ainda vir dados locais, dê refresh (Ctrl+R)

**Tempo:** ~30 segundos

---

## CHECKLIST FINAL

- [ ] Client ID adicionado em app.json ✅
- [ ] Client Secret adicionado em app.json ✅
- [ ] App reiniciado ✅
- [ ] Verificador mostra tudo ✅ ✅
- [ ] Spotify API retorna dados ✅
- [ ] Sem erros no console ✅

---

## 🎉 PRONTO!

Se todas as caixas estão marcadas, você configurou com sucesso! 🚀

Agora você pode:
- ✅ Buscar músicas
- ✅ Ver new releases
- ✅ Fazer login (se quiser)
- ✅ Criar playlists
- ✅ Tocar música

---

## ⏱️ TEMPO TOTAL

- Setup: ~10 minutos
- Teste: ~2 minutos
- **Total: ~12 minutos**

---

## 🆘 PROBLEMAS?

Se algo não funcionar:

1. **Erro de configuração?**
   - Leia: `APP_JSON_EXAMPLE.md`
   
2. **Erro de conexão?**
   - Leia: `TROUBLESHOOTING.md`

3. **Ainda com dúvida?**
   - Leia: `COMPLETE_SETUP_GUIDE.md`
   - Execute: `./setup-helpers.sh`

---

**Boa sorte! 🎵**
