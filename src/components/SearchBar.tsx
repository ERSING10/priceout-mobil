import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

export default function SearchBar() {
  const navigation = useNavigation<any>()

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('Search')}
      activeOpacity={0.7}
    >
      <Ionicons name="search" size={18} color="#888" />
      <Text style={styles.placeholder}>Ürün, kategori veya marka ara</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  placeholder: { color: '#888', fontSize: 14 },
})