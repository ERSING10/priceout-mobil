import { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Product } from '../types/product'
import { getCartIds, addToCart, removeFromCart } from '../lib/favorites'

export default function ProductDetailScreen() {
  const route = useRoute<any>()
  const navigation = useNavigation<any>()
  const { product, fromCart } = route.params as { product: Product; fromCart?: boolean }
    //sepetten cıkarma durumu için fromCart parametresi eklendi
  const [inCart, setInCart] = useState(false)

  useEffect(() => {
    checkIfInCart()
  }, [])

  async function checkIfInCart() {
    const ids = await getCartIds()
    setInCart(ids.includes(product.id))
  }

  async function handleAddToCart() {
    await addToCart(product.id)
    setInCart(true)
  }

  async function handleRemoveFromCart() {
    await removeFromCart(product.id)
    setInCart(false)
    navigation.goBack()
  }

  function handleGoToSite() {
    navigation.navigate('ProductWebView', { url: product.affiliate_link })
  }

  return (
    <ScrollView>
      {product.image_url ? (
        <Image source={{ uri: product.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>Görsel yok</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>

        {product.description && (
          <Text style={styles.description}>{product.description}</Text>
        )}

        <View style={styles.priceRow}>
          <Text style={styles.oldPrice}>{product.original_price}₺</Text>
          <Text style={styles.newPrice}>{product.discounted_price}₺</Text>
          <Text style={styles.discount}>%{product.discount_rate} indirim</Text>
        </View>

        {fromCart ? (
          <TouchableOpacity style={styles.removeButton} onPress={handleRemoveFromCart} activeOpacity={0.7}>
            <Text style={styles.removeButtonText}>Sepetten Çıkar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.cartButton, inCart && styles.cartButtonActive]}
            onPress={handleAddToCart}
            disabled={inCart}
            activeOpacity={0.7}
          >
            <Text style={[styles.cartButtonText, inCart && styles.cartButtonTextActive]}>
              {inCart ? 'Sepette ✓' : 'Sepete Ekle'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.siteButton} onPress={handleGoToSite} activeOpacity={0.7}>
          <Text style={styles.siteButtonText}>Siteye Git</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  image: { width: '100%', height: 320 },
  placeholder: { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#999' },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  description: { color: '#666', marginTop: 8, lineHeight: 20 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 },
  oldPrice: { textDecorationLine: 'line-through', color: '#aaa' },
  newPrice: { fontSize: 20, fontWeight: '700', color: '#16a34a' },
  discount: { color: '#dc2626', fontSize: 13 },
  cartButton: { marginTop: 20, backgroundColor: '#111', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  cartButtonActive: { backgroundColor: '#f0f0f0' },
  cartButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  cartButtonTextActive: { color: '#111' },
  removeButton: { marginTop: 20, backgroundColor: '#fee2e2', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  removeButtonText: { color: '#dc2626', fontWeight: '600', fontSize: 15 },
  siteButton: { marginTop: 10, borderWidth: 1, borderColor: '#111', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  siteButtonText: { color: '#111', fontWeight: '600', fontSize: 15 },
})