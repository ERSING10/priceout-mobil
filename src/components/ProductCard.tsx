import { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Product } from '../types/product'
import { getCartIds, addToCart, removeFromCart } from '../lib/favorites'

type Props = {
  product: Product
  cardWidth: number
  onRemoveFromCart?: () => void // opsiyonel, sepetteki ürünler için
}

export default function ProductCard({ product, cardWidth, onRemoveFromCart }: Props) {
  const [inCart, setInCart] = useState(false) // bu ürün sepette mi

  useEffect(() => {
    checkIfInCart()
  }, [])

  async function checkIfInCart() {
    const ids = await getCartIds()
    setInCart(ids.includes(product.id))
  }

  async function handleCartPress() {
    if (inCart) {
      await removeFromCart(product.id)
      setInCart(false)
      onRemoveFromCart?.() // opsiyonel callback'i çağır
    } else {
      await addToCart(product.id)
      setInCart(true)
    }
  }

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

      <TouchableOpacity
        style={[styles.cartButton, inCart && styles.cartButtonActive]}
        onPress={handleCartPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.cartButtonText, inCart && styles.cartButtonTextActive]}>
          {inCart ? (onRemoveFromCart ? 'Sepetten Çıkar' : 'Sepette ✓') : 'Sepete Ekle'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  image: { width: '100%', borderRadius: 10 },
  placeholder: { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 12, color: '#999' },
  title: { fontWeight: '600', marginTop: 8, fontSize: 14 },
  priceRow: { flexDirection: 'row', gap: 6, marginTop: 4, alignItems: 'center' },
  oldPrice: { textDecorationLine: 'line-through', color: '#aaa', fontSize: 12 },
  newPrice: { color: '#16a34a', fontWeight: '700', fontSize: 15 },
  discount: { fontSize: 11, color: '#dc2626', marginTop: 2 },
  cartButton: {
    marginTop: 10,
    backgroundColor: '#111',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cartButtonActive: { backgroundColor: '#f0f0f0' },
  cartButtonText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  cartButtonTextActive: { color: '#111' },
})