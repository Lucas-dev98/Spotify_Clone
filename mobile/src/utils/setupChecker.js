/**
 * Verificador de Configuração - Spotify Setup Checker
 * 
 * Use para debugar problemas de configuração
 * Rode em: npx expo start e abra no navegador browser console
 */

export function checkSpotifySetup() {
  console.log('🔍 Verificando configuração do Spotify...\n');
  
  const checks = [];
  
  // Check 1: Expo Constants
  try {
    const Constants = require('expo-constants').default;
    const extra = Constants.expoConfig?.extra || {};
    
    const hasClientId = !!extra.SPOTIFY_CLIENT_ID && extra.SPOTIFY_CLIENT_ID !== 'your_client_id_here';
    const hasClientSecret = !!extra.SPOTIFY_CLIENT_SECRET && extra.SPOTIFY_CLIENT_SECRET !== 'your_client_secret_here';
    
    checks.push({
      name: '✅ Expo Constants',
      status: hasClientId && hasClientSecret ? 'OK' : 'FALHA',
      details: {
        'Client ID': hasClientId ? '✅ Configurado' : '❌ Falta configurar',
        'Client Secret': hasClientSecret ? '✅ Configurado' : '❌ Falta configurar',
        'Valor do Client ID': hasClientId ? `${extra.SPOTIFY_CLIENT_ID.substring(0, 10)}...` : 'not set',
      }
    });
  } catch (error) {
    checks.push({
      name: '❌ Expo Constants',
      status: 'ERRO',
      details: { erro: error.message }
    });
  }
  
  // Check 2: Process Env
  const processClientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const processClientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
  
  checks.push({
    name: '📦 Process Environment',
    status: (processClientId || processClientSecret) ? 'OK' : 'VAZIO',
    details: {
      'REACT_APP_SPOTIFY_CLIENT_ID': processClientId ? '✅' : '❌',
      'REACT_APP_SPOTIFY_CLIENT_SECRET': processClientSecret ? '✅' : '❌',
    }
  });
  
  // Check 3: Spotify Config
  try {
    const spotifyConfig = require('../config/spotifyConfig').SPOTIFY_CONFIG;
    const isValid = spotifyConfig.clientId !== 'your_client_id_here' && 
                    spotifyConfig.clientSecret !== 'your_client_secret_here';
    
    checks.push({
      name: '🎵 Spotify Config',
      status: isValid ? 'OK' : 'INCOMPLETO',
      details: {
        'Client ID válido': isValid ? '✅' : '❌',
        'Config completa': isValid ? 'Sim' : 'Não',
      }
    });
  } catch (error) {
    checks.push({
      name: '❌ Spotify Config',
      status: 'ERRO',
      details: { erro: error.message }
    });
  }
  
  // Print Results
  console.group('📊 RESULTADOS DA VERIFICAÇÃO');
  
  let allPassed = true;
  for (const check of checks) {
    if (check.status !== 'OK') {
      allPassed = false;
    }
    
    const statusIcon = check.status === 'OK' ? '✅' : 
                       check.status === 'ERRO' ? '❌' : '⚠️';
    
    console.group(`${statusIcon} ${check.name} [${check.status}]`);
    console.table(check.details);
    console.groupEnd();
  }
  
  console.groupEnd();
  
  // Summary
  console.log('\n---\n');
  
  if (allPassed) {
    console.log('✅ TUDO CONFIGURADO! Spotify API deve funcionar.');
    console.log('ℹ️  Se ainda tiver erros, tente:');
    console.log('  1. Recarregar a página (Refresh)');
    console.log('  2. Limpar cache: npm install && npx expo start');
    console.log('  3. Verifique se Client ID/Secret estão corretos em app.json');
  } else {
    console.log('❌ CONFIGURAÇÃO INCOMPLETA');
    console.log('ℹ️  Passos para resolver:');
    console.log('  1. Abra: /home/lucasbastos/Spotify_App/Spotify/mobile/app.json');
    console.log('  2. Procure por "extra" section');
    console.log('  3. Adicione seu Client ID e Secret');
    console.log('  4. Salve o arquivo');
    console.log('  5. Reinicie o app (Ctrl+R no console)');
    console.log('\n📖 Leia SETUP_PASSO_A_PASSO.md para instruções completas');
  }
  
  console.log('\n---\n');
  
  return {
    allPassed,
    checks
  };
}

// Export para usar em componentes
export default checkSpotifySetup;
