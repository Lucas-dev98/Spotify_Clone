#!/bin/bash
# Comandos úteis para debug e teste da configuração do Spotify

echo "🎵 Spotify API Setup - Útil Commands"
echo "===================================="
echo ""

# Função: Ver conteúdo do app.json
show_config() {
  echo "📋 Conteúdo do app.json:"
  cat /home/lucasbastos/Spotify_App/Spotify/mobile/app.json | grep -A 5 '"extra"'
  echo ""
}

# Função: Verificar se credenciais estão configuradas
check_credentials() {
  echo "🔍 Verificando credenciais..."
  
  CLIENT_ID=$(grep "SPOTIFY_CLIENT_ID" /home/lucasbastos/Spotify_App/Spotify/mobile/app.json | grep -o '"[^"]*"' | tail -1 | tr -d '"')
  CLIENT_SECRET=$(grep "SPOTIFY_CLIENT_SECRET" /home/lucasbastos/Spotify_App/Spotify/mobile/app.json | grep -o '"[^"]*"' | tail -1 | tr -d '"')
  
  echo "Client ID: $CLIENT_ID"
  echo "Client Secret: ${CLIENT_SECRET:0:10}..." # Mostra apenas primeiros 10 chars
  
  if [[ "$CLIENT_ID" == "your_client_id_here" ]]; then
    echo "❌ Client ID ainda é placeholder!"
  else
    echo "✅ Client ID parece válido"
  fi
  
  if [[ "$CLIENT_SECRET" == "your_client_secret_here" ]]; then
    echo "❌ Client Secret ainda é placeholder!"
  else
    echo "✅ Client Secret parece válido"
  fi
  echo ""
}

# Função: Parar todos os processos
stop_all() {
  echo "🛑 Parando todos os processos Expo/Metro..."
  pkill -9 -f "expo" 2>/dev/null
  pkill -9 -f "metro" 2>/dev/null
  sleep 2
  echo "✅ Done"
  echo ""
}

# Função: Iniciar servidor
start_server() {
  echo "🚀 Iniciando servidor Expo..."
  cd /home/lucasbastos/Spotify_App/Spotify/mobile
  npx expo start
}

# Função: Iniciar web
start_web() {
  echo "🌐 Iniciando Expo Web..."
  cd /home/lucasbastos/Spotify_App/Spotify/mobile
  npx expo start --web
}

# Função: Limpar cache
clear_cache() {
  echo "🧹 Limpando cache..."
  
  cd /home/lucasbastos/Spotify_App/Spotify/mobile
  
  rm -rf .expo 2>/dev/null
  rm -rf node_modules/.expo 2>/dev/null
  rm -rf .next 2>/dev/null
  rm -rf dist 2>/dev/null
  
  echo "✅ Cache limpo"
  echo ""
}

# Função: Reinstalar dependências
reinstall_deps() {
  echo "📦 Reinstalando dependências..."
  
  cd /home/lucasbastos/Spotify_App/Spotify/mobile
  
  rm -rf node_modules
  npm install
  
  echo "✅ Dependências reinstaladas"
  echo ""
}

# Função: Ver logs de erro
show_errors() {
  echo "📋 Procurando erros conhecidos..."
  echo ""
  echo "Spotify Client ID:"
  grep -r "Client ID" /home/lucasbastos/Spotify_App/Spotify/mobile/src/ 2>/dev/null | head -3
  echo ""
  echo "Spotify Client Secret:"
  grep -r "Client Secret" /home/lucasbastos/Spotify_App/Spotify/mobile/src/ 2>/dev/null | head -3
  echo ""
}

# Função: Setup completo
full_setup() {
  echo "⚙️  SETUP COMPLETO"
  echo "===================================="
  echo ""
  
  stop_all
  clear_cache
  reinstall_deps
  
  echo "✅ Setup completo!"
  echo ""
  echo "Próximo passo: npm start"
  echo ""
}

# Menu
echo "Escolha uma opção:"
echo "1) Ver configuração (app.json)"
echo "2) Verificar credenciais"
echo "3) Parar todos os processos"
echo "4) Iniciar servidor (expo start)"
echo "5) Iniciar web (expo start --web)"
echo "6) Limpar cache"
echo "7) Reinstalar dependências"
echo "8) Ver erros"
echo "9) Setup Completo (para começar do zero)"
echo ""
read -p "Digite a opção (1-9): " option

case $option in
  1) show_config ;;
  2) check_credentials ;;
  3) stop_all ;;
  4) start_server ;;
  5) start_web ;;
  6) clear_cache ;;
  7) reinstall_deps ;;
  8) show_errors ;;
  9) full_setup ;;
  *) echo "Opção inválida!" ;;
esac
