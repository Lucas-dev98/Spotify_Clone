# 🎯 Como Preencher o Formulário do Spotify - CORRETO

## ⚠️ O QUE VOCÊ PREENCHEU (ERRADO)

```
App name: mySpotify ✅ (correto)
App description: spotify React Native ✅ (correto)
Website: http://localhost:19006 ❌ (ERRADO - isso é Redirect URI, não Website)
Redirect URIs: https://localhost:8081 ❌ (ERRADO - falta os outros)
Bundle IDs: (deixa em branco, é para apps móveis publicadas)
```

---

## ✅ COMO PREENCHER CORRETAMENTE

### 1️⃣ App name
```
mySpotify ✅
```

### 2️⃣ App description
```
spotify React Native ✅
```

### 3️⃣ Website (OPCIONAL)
```
http://localhost:19006
ou
deixar em branco (não é obrigatório para desenvolvimento)
```

### 4️⃣ Redirect URIs (IMPORTANTE!)
```
❌ ERRADO - O QUE VOCÊ PREENCHEU:
https://localhost:8081

✅ CORRETO - ADICIONE ESTAS (conforme validação Spotify 2025):

http://127.0.0.1:8081
http://127.0.0.1:3000/callback

NOTA IMPORTANTE:
- Use 127.0.0.1 (loopback IP explícito), NÃO "localhost"
- HTTP é permitido apenas para loopback IPs
- "localhost" não é mais aceito pelo Spotify desde Abril 2025
```

### 5️⃣ Bundle IDs (DEIXE EM BRANCO)
```
Android packages: (deixar vazio - não precisa para desenvolvimento)
```

---

## 🔧 COMO EDITAR NO SPOTIFY DASHBOARD

1. Vá em: **https://developer.spotify.com/dashboard**
2. Clique na app: **mySpotify**
3. Clique em: **Edit Settings**

4. Encontre: **Redirect URIs**

5. **Se você já adicionou `https://localhost:8081`:**
   - Clique no X para remover
   - Clique em "Add a Redirect URI"

6. **Adicione CADA UM DESTES (um por um):**
   ```
   http://127.0.0.1:8081
   ```
   Clique "Add"
   
   ```
   http://127.0.0.1:3000/callback
   ```
   Clique "Add"

7. Clique: **Save**

---

## ✅ RESULTADO ESPERADO

Após salvar, você deve ver:

```
Redirect URIs:
✅ http://127.0.0.1:8081
✅ http://127.0.0.1:3000/callback
```

---

## 🚫 ERROS COMUNS

### ❌ Erro: "Invalid redirect URI format"

**Causas:**
- Digitou `https` em vez de `http`
- Digitou porta errada
- Espaços extras

**Solução:**
- Copie e cole exatamente (sem espaços)
- Use `http://` (não `https://`)
- Verifique porta: 19006 (não 8081 sozinho)

### ❌ Erro: "URI already added"

**Causa:** Você já adicionou este URI

**Solução:**
- Remova e adicione novamente
- Ou use outro URI (ex: com seu IP)

---

## 📝 RESUMO

| Campo | Valor | Notas |
|-------|-------|-------|
| App name | mySpotify | Obrigatório |
| App description | spotify React Native | Obrigatório |
| Website | http://127.0.0.1:8081 | Opcional |
| Redirect URIs | Ver acima | **MUITO IMPORTANTE** |
| Bundle IDs | (deixar vazio) | Para apps publicadas |

---

## 🔗 REDIRECT URIs FINAIS

```
http://127.0.0.1:8081           ← Web local (Expo)
http://127.0.0.1:3000/callback  ← Fallback web
```

⚠️ CONFORME VALIDAÇÃO SPOTIFY NOVEMBER 2025:
- ✅ Usar loopback IP explícito (127.0.0.1)
- ❌ NÃO usar "localhost"
- ✅ HTTP permitido APENAS para loopback IPs
- ✅ Incluir porta específica

---

**Pronto? Edite e salve! 🚀**
