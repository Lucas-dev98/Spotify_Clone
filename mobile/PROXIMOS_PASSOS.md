# 🎯 PRÓXIMOS PASSOS - O Que Fazer AGORA

Você já criou a app no Spotify! Agora faltam 3 coisas:

---

## ⚠️ PASSO 1: CORRIGIR Redirect URI (IMPORTANTE!)

Seu URI tem um typo que precisa corrigir:

**❌ ERRADO:**
```
http://localhost:190006  ← 3 zeros!
```

**✅ CORRETO:**
```
http://localhost:19006   ← 2 zeros!
```

### Como Corrigir:

1. Vá em: https://developer.spotify.com/dashboard
2. Clique em: **mySpotify** (sua app)
3. Clique em: **Edit Settings**
4. Em **Redirect URIs**, remova a URI com typo
5. Adicione ESTAS URIs:
   ```
   http://localhost:19006
   http://localhost:3000/callback
   exp://localhost:8081
   exp://192.168.1.68:8081
   ```
6. Clique: **Save**

**⏱️ Leva 1 minuto**

---

## 🔐 PASSO 2: Copiar Client Secret

Na mesma página, procure por:

**Client Secret** (pode estar escondido)

- Procure por botão: "Show Client Secret"
- Clique para revelar
- **COPIE o valor** 🔐

**Vai ser algo como:**
```
xyz987uvw654rst321opq098abcdefg123hijkl
```

**⏱️ Leva 30 segundos**

---

## ✅ PASSO 3: Adicionar em app.json

Abra o arquivo:
```
/home/lucasbastos/Spotify_App/Spotify/mobile/app.json
```

Encontre esta seção:
```json
"extra": {
  "SPOTIFY_CLIENT_ID": "your_client_id_here",
  "SPOTIFY_CLIENT_SECRET": "your_client_secret_here"
}
```

Substitua pelos seus valores:

```json
"extra": {
  "SPOTIFY_CLIENT_ID": "031e7c3ae27041cc8e930273af160b87",
  "SPOTIFY_CLIENT_SECRET": "xyz987uvw654rst321opq098abcdefg123hijkl"
}
```

**IMPORTANTE:**
- ✅ Client ID: `031e7c3ae27041cc8e930273af160b87` (você já tem)
- ✅ Client Secret: Cole o que você copiou no PASSO 2
- ✅ Sem aspas extras
- ✅ Sem espaços

Depois salve (Ctrl+S)

**⏱️ Leva 1 minuto**

---

## 🚀 PASSO 4: Reiniciar App

No terminal:

```bash
pkill -9 -f "expo"
cd /home/lucasbastos/Spotify_App/Spotify/mobile
npx expo start
```

Aguarde ~10 segundos para compilar.

**⏱️ Leva 2 minutos**

---

## ✅ PASSO 5: Verificar se Funcionou

1. Abra no navegador: http://localhost:19006
2. Abra console (F12)
3. Procure por: `RESULTADOS DA VERIFICAÇÃO`
4. Você deve ver:

```
✅ ✅ Expo Constants [OK]
✅ ✅ Process Environment [OK]
✅ ✅ Spotify Config [OK]
✅ TUDO CONFIGURADO! Spotify API deve funcionar.
```

Se vir muitos ✅ = **SUCESSO! 🎉**

Se vir ❌ = Leia `TROUBLESHOOTING.md`

**⏱️ Leva 30 segundos**

---

## ⏱️ TEMPO TOTAL

- Corrigir URI: ~1 min
- Copiar Secret: ~30 sec
- Adicionar em app.json: ~1 min
- Reiniciar: ~2 min
- Verificar: ~30 sec

**TOTAL: ~5 minutos** ⚡

---

## 🎉 PRONTO!

Após completar estes 5 passos, você terá:
- ✅ Spotify API configurada
- ✅ App rodando no localhost:19006
- ✅ Pronto para usar!

---

## 📚 Documentação Relacionada

- **CORRIGIR_REDIRECT_URIS.md** - Instruções detalhadas do Passo 1
- **GUIA_FINAL.md** - Resumo geral
- **TROUBLESHOOTING.md** - Se der erro
- **APP_JSON_EXAMPLE.md** - Exemplos de app.json

---

## 🆘 Precisa de Ajuda?

| Problema | Arquivo |
|----------|---------|
| "Como copiar Client Secret?" | SETUP_CREDENTIALS.md |
| "Deu erro no formulário" | COMO_PREENCHER_FORM.md |
| "Client ID not configured" | TROUBLESHOOTING.md |
| "Preciso de exemplos de código" | SPOTIFY_EXAMPLES.js |

---

**Pronto? Comece pelo PASSO 1! 🚀**
