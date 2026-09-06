import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Product } from '../types/product'

type Props = {
  product: Product
  cardWidth: number
  fromCart?: boolean
  brandName?: string
}

export default function ProductCard({ product, cardWidth, fromCart, brandName }: Props) {
  const navigation = useNavigation<any>()
  const imageHeight = product.category === 'Ayakkabı'
    ? cardWidth
    : cardWidth * 1.35
  const scale = cardWidth / 160
  const brandSize = 12 * scale
  const titleSize = 11 * scale
  const priceSize = 15 * scale
  const oldPriceSize = 10 * scale

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

      <View style={styles.bottomRow}>
        <View style={styles.textCol}>
          {brandName && <Text style={[styles.brand, { fontSize: brandSize }]}>{brandName}</Text>}
          <Text style={[styles.title, { fontSize: titleSize }]} numberOfLines={2}>{product.title}</Text>
        </View>

        <View style={styles.priceCol}>
          <Text style={[styles.newPrice, { fontSize: priceSize }]}>{product.discounted_price} ₺</Text>
          <View style={styles.discountRow}>
            {product.discount_rate > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>%{product.discount_rate}</Text>
              </View>
            )}
            {product.original_price > product.discounted_price && (
              <Text style={[styles.oldPrice, { fontSize: oldPriceSize }]}>{product.original_price} ₺</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  imageWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: { width: '100%' },
  placeholder: { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 11, color: '#999' },

  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 6 },
  textCol: { flex: 1, marginRight: 4 },
  brand: { fontWeight: '800', color: '#111' },
  title: { color: '#888', marginTop: 2 },

  priceCol: { alignItems: 'flex-end' },
  newPrice: { fontWeight: '800', color: '#111' },
  discountRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  discountBadge: { backgroundColor: '#16a34a', borderRadius: 5, paddingHorizontal: 5, paddingVertical: 1 },
  discountBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  oldPrice: { color: '#dc2626', textDecorationLine: 'line-through' },
})