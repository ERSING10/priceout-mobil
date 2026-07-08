import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Brand } from '../types/product'

type Props = {
  brand: Brand
  onPress: () => void // tıklanınca ne olacağını dışarıdan alıyoruz
}

export default function BrandCard({ brand, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {brand.logo_url ? (
        <Image source={{ uri: brand.logo_url }} style={styles.logo} />
      ) : (
        <View style={[styles.logo, styles.placeholder]}>
          <Text style={styles.placeholderText}>{brand.name[0]}</Text>
        </View>
      )}
      <Text style={styles.name}>{brand.name}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  logo: { width: 64, height: 64, borderRadius: 32, marginBottom: 8 },
  placeholder: { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 24, fontWeight: '700', color: '#999' },
  name: { fontWeight: '600', fontSize: 14, textAlign: 'center' },
})