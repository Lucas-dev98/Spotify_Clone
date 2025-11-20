# Spotify Mobile (Expo)

Scaffold mínimo do app convertido para React Native usando Expo.

Quick start

```bash
cd mobile
npm install
npx expo start
```

Recomendações
- Instale globalmente o Expo CLI se preferir: `npm install -g expo-cli`.
- O projeto inclui `expo-av` para reprodução de áudio e `react-navigation` para navegação (dependências listadas em `package.json`).

Backend URL / conexão
- Por padrão o app tenta usar um endereço útil para emuladores:
	- Android emulator (Android Studio): `http://10.0.2.2:3000`
	- iOS simulator / web: `http://localhost:3000`

Se você testar em um dispositivo físico via Expo (telefones na mesma rede), substitua a URL no arquivo `mobile/src/config.js` por `http://<SEU_IP_LOCAL>:3000` (ex: `http://192.168.1.100:3000`).

Antes de abrir o app, rode o backend na pasta `back-end/`:

```bash
cd ../back-end
npm install
npm start
```

Verifique em um navegador ou curl que `http://<HOST>:3000/songs` e `/artists` respondem com JSON.

Próximos passos
- Migrar componentes restantes de `src/` do app web.
- Ajustar estilos e layouts para mobile.
- Integrar backend (use o IP/URL do seu servidor `back-end/api/server.js`).
