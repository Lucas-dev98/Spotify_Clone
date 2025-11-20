import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import SingleItem from './SingleItem';
import { useNavigation } from '@react-navigation/native';

export default function ItemList({ title, items = 10, itemsArray = [], path = 'Artists', idPath = '/artist' }) {
  const navigation = useNavigation();

  if (!itemsArray || itemsArray.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title} populares</Text>
        </View>
        <Text style={{ paddingHorizontal: 12, color: '#999' }}>Nenhum item disponível</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title} populares</Text>
        <TouchableOpacity onPress={() => navigation.navigate(path)}>
          <Text style={styles.link}>Mostrar tudo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={itemsArray.slice(0, items)}
        scrollEnabled={false}
        keyExtractor={(item, i) => String(item?.id || i)}
        renderItem={({ item }) => (
          <SingleItem {...item} idPath={idPath} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 12, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '700', color: '#000' },
  link: { color: '#1db954', fontWeight: '700', fontSize: 13 },
});

