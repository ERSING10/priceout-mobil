import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Product } from '../types/product'

type Props = {
  product: Product
}

export default function BrandProductRow({ product }: Props) {
  const navigation = useNavigation<any>()

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={() => navigation.navigate('ProductDetail', { product })}
    >
      {product.image_url ? (
        <Image source={{ uri: product.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{product.title}</Text>
        {product.description && (
          <Text style={styles.description} numberOfLines={2}>{product.description}</Text>
        )}
        <View style={styles.priceRow}>
          <Text style={styles.newPrice}>{product.discounted_price} ₺</Text>
          {product.original_price > product.discounted_price && (
            <Text style={styles.oldPrice}>{product.original_price} ₺</Text>
          )}
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  rowPressed: { backgroundColor: '#fafafa', transform: [{ scale: 0.98 }] },

  image: { width: 100, height: 100, borderRadius: 10, backgroundColor: '#f0f0f0' },
  placeholder: { backgroundColor: '#eee' },

  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '700', color: '#1a1625', marginBottom: 4 },
  description: { fontSize: 12, color: '#888', marginBottom: 6 },

  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  newPrice: { fontSize: 16, fontWeight: '800', color: '#111' },
  oldPrice: { fontSize: 12, color: '#aaa', textDecorationLine: 'line-through' },
})