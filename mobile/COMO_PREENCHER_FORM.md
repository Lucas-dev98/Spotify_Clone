# 📋 Como Preencher o Formulário - Spotify Developer App

## 🎯 Tela: Create an App

### Campo 1: App name* (required)

**O que colocar:**
```
mySpotify
```

ou qualquer nome que queira. Exemplos:
- ✅ `Spotify Mobile`
- ✅ `Spotify React Native`
- ✅ `Meu App de Música`
- ✅ `SpotifyPlayer`

**Regra:** Pode ter letras, números, espaços e hífens

---

### Campo 2: App description* (required)

**O que colocar:**
```
spotify React Native
```

ou uma descrição melhor. Exemplos:
- ✅ `Aplicativo Spotify para React Native e Expo`
- ✅ `Music streaming app built with React Native`
- ✅ `Player de música usando Spotify Web API`
- ✅ `App móvel de músicas`

**Regra:** Descreva brevemente o que sua app faz

---

### Campo 3: Website (optional)

**Pode deixar em branco OU colocar:**
```
http://localhost:19006
```

ou

```
https://seusite.com
```

**Regra:** Se tiver site, coloque. Se não tiver, deixe em branco (é opcional!)

---

### Campo 4: Redirect URIs* (required) ⭐ IMPORTANTE!

**Aqui é onde a maioria erra!** ⚠️

**Precisa adicionar MÚLTIPLAS URIs**, dependendo de onde vai usar:

#### PARA WEB (Desktop no navegador):
```
http://localhost:19006
http://localhost:3000/callback
```

#### PARA MOBILE (Android/iOS com Expo):
```
exp://localhost:8081
exp://192.168.1.68:8081
```

#### PARA PRODUÇÃO (quando colocar no ar):
```
https://seuapp.com/callback
```

---

## ✅ EXEMPLO COMPLETO

### Preenchimento Correto:

```
App name:
  mySpotify

App description:
  Aplicativo Spotify em React Native

Website:
  http://localhost:19006

Redirect URIs:
  http://localhost:19006
  http://localhost:3000/callback
  exp://localhost:8081
  exp://192.168.1.68:8081
```

---

## 🔴 ERRO: "Please enter a valid redirect URI"

### Causa Comum:

❌ Formatos INVÁLIDOS:
```
https://example.org/callback    ← Errado! Não é real
localhost:19006                 ← Falta http://
http://localhost                ← Incompleto, sem porta
```

### Formatos VÁLIDOS:

✅ Para Desenvolvimento Local:
```
http://localhost:19006
http://localhost:3000/callback
http://127.0.0.1:19006
http://192.168.1.68:8081
```

✅ Para Expo (Mobile):
```
exp://localhost:8081
exp://192.168.1.68:8081
```

✅ Para Produção:
```
https://seu-dominio.com/callback
```

---

## 📝 PASSO A PASSO VISUAL

### 1️⃣ Abrir https://developer.spotify.com/dashboard

### 2️⃣ Clique "Create an App"

### 3️⃣ Preencha EXATAMENTE assim:

```
┌─────────────────────────────────┐
│ App name*                        │
│ ┌────────────────────────────────┤
│ │ mySpotify                      │
│ └────────────────────────────────┤
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ App description*                 │
│ ┌────────────────────────────────┤
│ │ Spotify React Native App       │
│ └────────────────────────────────┤
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Website                          │
│ ┌────────────────────────────────┤
│ │ http://localhost:19006         │
│ └────────────────────────────────┤
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Redirect URIs*                   │
│ ┌────────────────────────────────┤
│ │ http://localhost:19006         │
│ │ http://localhost:3000/callback │
│ │ exp://localhost:8081           │
│ │ exp://192.168.1.68:8081        │
│ └────────────────────────────────┤
└─────────────────────────────────┘
```

### 4️⃣ Marque as checkboxes de termos

### 5️⃣ Clique "Create"

---

## 🔐 REDIRECT URIs Explicado

### O que é?
Um Redirect URI é para onde o Spotify redireciona após o usuário fazer login.

### Exemplo de Fluxo:
```
1. App pede: "Faça login no Spotify"
2. Spotify abre: spotify.com/login
3. Usuário faz login
4. Spotify redireciona para: http://localhost:19006
5. App recebe: token de acesso
```

### Por que precisa de múltiplas?
Porque você pode rodar em:
- ✅ Web (localhost:19006)
- ✅ Web callback (localhost:3000)
- ✅ Expo Android (exp://192.168.1.68:8081)
- ✅ Produção (https://seu-app.com)

Cada ambiente precisa de um URI diferente!

---

## ⚠️ ERROS COMUNS

### ❌ Erro 1: "Please enter a valid redirect URI"
**Causa:** Formato inválido
**Solução:** Use `http://` no início

### ❌ Erro 2: "URI já existe"
**Causa:** Tentou adicionar URI duplicada
**Solução:** Remova a URI anterior, depois adicione de novo

### ❌ Erro 3: "Cannot reach URI"
**Causa:** Spotify tentou validar e não conseguiu
**Solução:** Ignore esse erro (é só validação)

---

## ✅ APÓS PREENCHER

1. Clique "Create"
2. Aceite os termos (novamente)
3. Você receberá:
   - **Client ID** ← COPIA ISTO
   - **Client Secret** ← COPIA ISTO E GUARDE COM SEGURANÇA

---

## 📝 Checklist

- [ ] Preencheu "App name"
- [ ] Preencheu "App description"
- [ ] Adicionou "Redirect URIs" corretos
- [ ] Marcou checkboxes de termos
- [ ] Clicou "Create"
- [ ] Copiou Client ID
- [ ] Copiou Client Secret
- [ ] Adicionou em `app.json`

---

## 🎉 Pronto!

Agora você tem:
- Client ID para colocar em `app.json`
- Client Secret para colocar em `app.json`
- App registrada no Spotify Developer

Próximo passo: Editar `app.json` com essas credenciais!

---

## 🔗 Links Úteis

- Dashboard: https://developer.spotify.com/dashboard
- Documentação: https://developer.spotify.com/documentation
- Web API: https://developer.spotify.com/documentation/web-api
