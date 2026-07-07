import { View, Text, Image, StyleSheet } from 'react-native'
import { Product } from '../types/product'

type Props = {
  product: Product
  cardWidth: number // dışarıdan gelecek, ProductList hesaplayacak
}

export default function ProductCard({ product, cardWidth }: Props) {
  // size 10-100 arası geliyor, bunu piksel yüksekliğine çeviriyoruz
  const imageHeight = 150 + (product.size / 100) * 170

  return (
    <View style={[styles.card, { width: cardWidth }]}>
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

      <View style={styles.priceRow}>
        <Text style={styles.oldPrice}>{product.original_price}₺</Text>
        <Text style={styles.newPrice}>{product.discounted_price}₺</Text>
      </View>

      <Text style={styles.discount}>%{product.discount_rate} indirim</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 8, marginBottom: 8 },
  image: { width: '100%', borderRadius: 8 },
  placeholder: { backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 12, color: '#999' },
  title: { fontWeight: '600', marginTop: 6 },
  priceRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  oldPrice: { textDecorationLine: 'line-through', color: '#999', fontSize: 12 },
  newPrice: { color: 'green', fontWeight: '700' },
  discount: { fontSize: 11, color: 'red', marginTop: 2 },
})