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
  const imageHeight = cardWidth

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={() => navigation.navigate('ProductDetail', { product, fromCart })}
      activeOpacity={0.85}
    >
      <View style={styles.imageWrapper}>
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
      </View>

      {product.discount_rate > 0 && (
        <View style={styles.discountStrip}>
          <Text style={styles.discountStripText}>%{product.discount_rate} indirim</Text>
        </View>
      )}

      <Text style={styles.title} numberOfLines={1}>{product.title}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.newPrice}>{product.discounted_price} ₺</Text>
        {product.original_price > product.discounted_price && (
          <Text style={styles.oldPrice}>{product.original_price} ₺</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  imageWrapper: { borderRadius: 10, overflow: 'hidden' },
  image: { width: '100%' },
  placeholder: { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 11, color: '#999' },

  discountStrip: {
    backgroundColor: '#dc2626',
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 6,
  },
  discountStripText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  title: { fontSize: 12, color: '#333', marginTop: 4 },

  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 5, marginTop: 3 },
  newPrice: { fontSize: 14, fontWeight: '800', color: '#111' },
  oldPrice: { fontSize: 11, color: '#aaa', textDecorationLine: 'line-through' },
})