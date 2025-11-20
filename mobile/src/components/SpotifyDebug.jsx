/**
 * Component to test and debug Spotify API connection
 * Use this to verify your credentials are working
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { getSpotifyAccessToken, setSpotifyCredentials } from '../services/spotifyAuth';
import { searchTracks, getNewReleases } from '../services/spotifyApi';

export default function SpotifyDebug() {
  const [status, setStatus] = useState('Ready');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  async function testAuth() {
    setLoading(true);
    try {
      setStatus('Testing authentication...');
      const token = await getSpotifyAccessToken();
      setStatus(`✅ Auth successful! Token: ${token.substring(0, 20)}...`);
      setResults(token);
    } catch (error) {
      setStatus(`❌ Auth failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function testSearch() {
    setLoading(true);
    try {
      setStatus('Searching tracks...');
      const tracks = await searchTracks('thriller', 5);
      setStatus(`✅ Found ${tracks.length} tracks`);
      setResults(tracks);
    } catch (error) {
      setStatus(`❌ Search failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function testNewReleases() {
    setLoading(true);
    try {
      setStatus('Fetching new releases...');
      const releases = await getNewReleases(5);
      setStatus(`✅ Found ${releases.length} releases`);
      setResults(releases);
    } catch (error) {
      setStatus(`❌ Releases failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function clearResults() {
    setResults(null);
    setStatus('Ready');
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🎵 Spotify API Debug</Text>
      
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={[styles.button, styles.buttonPrimary]}
          onPress={testAuth}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Testing...' : 'Test Auth'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonSecondary]}
          onPress={testSearch}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Search</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonSecondary]}
          onPress={testNewReleases}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Releases</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonDanger]}
          onPress={clearResults}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#1db954" />}

      {results && (
        <View style={styles.resultsBox}>
          <Text style={styles.resultsTitle}>Results:</Text>
          <Text style={styles.resultsText}>
            {typeof results === 'string' 
              ? results 
              : JSON.stringify(results, null, 2)
            }
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: '700', 
    marginBottom: 20, 
    color: '#1db954' 
  },
  statusBox: { 
    backgroundColor: '#f5f5f5', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 20,
    minHeight: 60,
    justifyContent: 'center',
  },
  statusText: { 
    fontSize: 14, 
    color: '#333',
    fontFamily: 'monospace',
  },
  buttonGroup: { 
    marginBottom: 20, 
    gap: 8 
  },
  button: { 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonPrimary: { 
    backgroundColor: '#1db954' 
  },
  buttonSecondary: { 
    backgroundColor: '#333' 
  },
  buttonDanger: { 
    backgroundColor: '#d00' 
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 14 
  },
  resultsBox: { 
    backgroundColor: '#f9f9f9', 
    padding: 12, 
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1db954',
  },
  resultsTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    marginBottom: 8 
  },
  resultsText: { 
    fontSize: 12, 
    color: '#666',
    fontFamily: 'monospace',
  },
});
