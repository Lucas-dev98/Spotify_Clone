# 🔐 Spotify Redirect URI Validation - Novembro 2025

## ⚠️ MUDANÇAS IMPORTANTES

A partir de **Abril 2025** (e obrigatório até **Novembro 2025**), o Spotify implementou validações mais rigorosas para Redirect URIs.

## ❌ O QUE NÃO É MAIS PERMITIDO

- `http://localhost:PORT` - **localhost não é permitido**
- `https://localhost:PORT` - **localhost não é permitido**
- `exp://localhost:PORT` - **localhost não é permitido**
- `exp://192.168.1.68:PORT` - **IPs privados não-loopback não são permitidos**

## ✅ O QUE É PERMITIDO

### Para Desenvolvimento Local (Loopback)

**Usar IPv4 loopback explícito:**
```
http://127.0.0.1:PORT
```

**OU usar IPv6 loopback explícito:**
```
http://[::1]:PORT
```

### Para Produção

**Usar HTTPS com domínio válido:**
```
https://example.com/callback
https://app.example.com/auth/callback
```

---

## 🎯 REDIRECT URIs CORRETOS PARA ESTE APP

### Para Desenvolvimento (Expo Web)

```
http://127.0.0.1:8081
http://127.0.0.1:3000/callback
```

### Para Produção (após deploy)

```
https://seu-dominio.com/callback
```

---

## 📋 GUIA DE ATUALIZAÇÃO

### Passo 1: Identificar URIs Inválidas

Vá em: https://developer.spotify.com/dashboard

1. Clique na app **mySpotify**
2. Clique em **Edit Settings**
3. Veja a seção **Redirect URIs**

### Passo 2: Remover URIs Inválidas

Se você tem algo como:
- ❌ `http://localhost:19006` → REMOVA
- ❌ `http://localhost:3000/callback` → REMOVA
- ❌ `exp://localhost:8081` → REMOVA
- ❌ `exp://192.168.1.68:8081` → REMOVA
- ❌ `https://localhost:8081` → REMOVA

Clique no X para remover cada uma.

### Passo 3: Adicionar URIs Válidas

Clique em "Add a Redirect URI" para cada uma:

```
http://127.0.0.1:19006
```

```
http://127.0.0.1:3000/callback
```

### Passo 4: Salvar

Clique em **Save**

---

## 🔧 COMO FUNCIONA NO SEU APP

O app usa `AuthSession.getRedirectUrl()` do Expo, que **automaticamente** retorna o redirect URI correto:

### Durante Desenvolvimento (Web)
```javascript
// Expo automaticamente retorna:
redirectUrl = "http://127.0.0.1:8081"
```

### Após Deploy
```javascript
// Você configura em app.json:
"extra": {
  "SPOTIFY_REDIRECT_URI": "https://seu-dominio.com/callback"
}
```

---

## 📊 RESUMO DAS MUDANÇAS

| Antes (Inválido) | Depois (Válido) | Razão |
|---|---|---|
| `http://localhost:19006` | `http://127.0.0.1:19006` | "localhost" não permitido |
| `exp://localhost:8081` | *(não necessário para web)* | "localhost" não permitido |
| `exp://192.168.1.68:8081` | *(não necessário para web)* | IP privado não-loopback |

---

## ⚡ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Atualizar Redirect URIs no Spotify Dashboard
- [ ] Remover URIs com "localhost"
- [ ] Usar apenas `127.0.0.1` (IPv4 loopback)
- [ ] Testar app em http://127.0.0.1:19006
- [ ] Verificar console para erros de redirect
- [ ] Confirmar login funciona

---

## 🚀 TESTING

Após atualizar, teste em:

```
http://127.0.0.1:19006
```

Quando fizer login, verifique no console:

```
✅ Redirect URL: http://127.0.0.1:19006 (ou similar)
✅ Auth successful
✅ Token received
```

---

## 📚 REFERÊNCIAS

- **Spotify Security Blog**: https://developer.spotify.com/blog/2025-04-redirect-uri-validation
- **OAuth 2.0 Loopback RFC**: https://tools.ietf.org/html/rfc8252

---

## ❓ PERGUNTAS FREQUENTES

### P: Por que localhost foi removido?
**R:** Segurança. O loopback IP 127.0.0.1 é mais específico e previne ataques de DNS spoofing.

### P: Preciso usar 127.0.0.1 em produção?
**R:** Não, em produção use seu domínio com HTTPS:
```
https://seu-dominio.com/callback
```

### P: E se eu não atualizar até Novembro 2025?
**R:** Apps não atualizados deixarão de funcionar.

### P: Meu app ainda funciona com localhost?
**R:** No momento sim, mas será rejeitado até Novembro 2025.

### P: Posso usar IPv6 [::1]?
**R:** Sim, mas IPv4 127.0.0.1 é mais comum e compatível.

---

**Última atualização**: 20 de Novembro 2025

Arquivo de referência: `COMO_PREENCHER_CORRETO.md`
