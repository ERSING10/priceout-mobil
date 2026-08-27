import { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Product } from '../types/product'
import { getCartIds, addToCart, removeFromCart } from '../lib/cart'

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
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#111', letterSpacing: -0.3 },
  description: { color: '#666', marginTop: 10, lineHeight: 21, fontSize: 14 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 18 },
  oldPrice: { textDecorationLine: 'line-through', color: '#aaa', fontSize: 15 },
  newPrice: { fontSize: 24, fontWeight: '800', color: '#16a34a' },
  discount: { color: '#dc2626', fontSize: 13, fontWeight: '600', backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },

  cartButton: {
    marginTop: 28,
    backgroundColor: '#111',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  cartButtonActive: { backgroundColor: '#f0f0f0', shadowOpacity: 0 },
  cartButtonText: { color: '#fff', fontWeight: '700', fontSize: 15, letterSpacing: 0.2 },
  cartButtonTextActive: { color: '#999' },

  removeButton: { marginTop: 28, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#fee2e2' },
  removeButtonText: { color: '#dc2626', fontWeight: '700', fontSize: 15 },

  siteButton: { marginTop: 12, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#111' },
  siteButtonText: { color: '#111', fontWeight: '700', fontSize: 15, letterSpacing: 0.2 },
})