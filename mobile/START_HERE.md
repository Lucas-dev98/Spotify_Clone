# ⚡ QUICK CHECKLIST - Comece em 5 Minutos!

## PASSO 1: Obter Credenciais (2 min)

```
[ ] Abrir: https://developer.spotify.com/dashboard
[ ] Fazer login / Criar conta
[ ] Clicar "Create an App"
[ ] Preencher nome (ex: "Spotify Mobile")
[ ] Aceitar termos
[ ] Clicar "Create"
[ ] Copiar "Client ID" (guardar em safe place)
[ ] Clicar "Show Client Secret" 
[ ] Copiar "Client Secret" (SEGREDO!)
```

## PASSO 2: Adicionar ao Projeto (1 min)

```bash
# Na pasta mobile/
cp .env.example .env.local

# Abrir .env.local com editor
nano .env.local
# ou
code .env.local

# Substituir pelos seus valores:
REACT_APP_SPOTIFY_CLIENT_ID=PASTE_YOUR_ID_HERE
REACT_APP_SPOTIFY_CLIENT_SECRET=PASTE_YOUR_SECRET_HERE

# Salvar arquivo
```

## PASSO 3: Instalar Dependências (1 min)

```bash
cd mobile
npm install --legacy-peer-deps
```

## PASSO 4: Rodar App (1 min)

```bash
npm start

# Esperar aparecer menu
# Pressionar 'w' para web
# OU
# Pressionar 'a' para Android emulator
```

## PASSO 5: Verificar (Immediate!)

Na app você vai ver:
```
✅ Header verde "Spotify"
✅ "Conectando ao Spotify..."
✅ Depois: Lista de artistas
✅ Depois: Lista de músicas
✅ Clique em música → abre detalhes
✅ Na página da música tem botão "Play"
```

---

## ✅ Pronto!

Se tudo acima funcionou → **Spotify API está rodando!** 🎉

Se deu erro → Ver `TROUBLESHOOTING.md`

---

## 🎵 O Que Fazer Agora

1. Clique em uma música
2. Clique "Play" para ouvir
3. Explore diferentes artistas
4. Divirta-se! 🚀

---

## ⚠️ IMPORTANTE

NÃO FAÇA ISTO:
- ❌ NÃO compartilhe seu `.env.local` com ninguém
- ❌ NÃO faça commit de `.env.local` para git
- ❌ NÃO exponha seu Client Secret online
- ❌ NÃO publique no GitHub com secrets!

---

**Sucesso!** 🎵✨
