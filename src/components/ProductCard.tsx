import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Product } from '../types/product'

type Props = {
  product: Product
  cardWidth: number
  fromCart?: boolean
}

export default function ProductCard({ product, cardWidth, fromCart }: Props) {
  const navigation = useNavigation<any>()
  const imageHeight = 150 + (product.size / 100) * 170

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={() => navigation.navigate('ProductDetail', { product, fromCart })}
      activeOpacity={0.8}
    >
      {product.image_url ? (
        <Image
          source={{ uri: product.image_url }}
          style={[styles.image, { height: imageHeight }]}
        />
      ) : (
        <View style={[styles.image, styles.placeholder, { height: imageHeight }]}>
          <Text style={styles.placeholderText}>Görsel yok</Text>
        </View>
      )}
      <Text style={styles.title} numberOfLines={1}>{product.title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 8, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  image: { width: '100%', borderRadius: 10 },
  placeholder: { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 12, color: '#999' },
  title: { fontWeight: '600', marginTop: 8, fontSize: 14 },
})