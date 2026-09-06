import { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Share, Platform, StatusBar, SafeAreaView } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { Product } from '../types/product'
import { getCartIds, addToCart, removeFromCart } from '../lib/cart'
import TopBar from '../components/TopBar'

export default function ProductDetailScreen() {
  const route = useRoute<any>()
  const navigation = useNavigation<any>()
  const { product, fromCart, brandName } = route.params as { product: Product; fromCart?: boolean; brandName?: string }
  const [inCart, setInCart] = useState(false)

  useEffect(() => {
    checkIfInCart()
  }, [])

  async function checkIfInCart() {
    const ids = await getCartIds()
    setInCart(ids.includes(product.id))
  }

  async function toggleFavorite() {
    if (inCart) {
      await removeFromCart(product.id)
      setInCart(false)
      if (fromCart) navigation.goBack()
    } else {
      await addToCart(product.id)
      setInCart(true)
    }
  }

  function handleGoToSite() {
    navigation.navigate('ProductWebView', { url: product.affiliate_link })
  }

  function handleShare() {
    Share.share({ message: product.affiliate_link })
  }

  function formatPrice(price: number) {
    return price.toLocaleString('tr-TR')
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#1a1625" />
        </TouchableOpacity>

        <View style={styles.imageCard}>
          {product.image_url ? (
            <Image source={{ uri: product.image_url }} style={styles.image} resizeMode="contain" />
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <Text style={styles.placeholderText}>Görsel yok</Text>
            </View>
          )}

          {product.discount_rate > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>%{product.discount_rate}</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.brand}>{brandName ?? ''}</Text>
          <Text style={styles.title}>{product.title}</Text>

          <Text style={styles.newPrice}>{formatPrice(product.discounted_price)}₺</Text>
          {product.original_price > product.discounted_price && (
            <Text style={styles.oldPrice}>Önceki Fiyat: {formatPrice(product.original_price)}₺</Text>
          )}

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.siteButton} onPress={handleGoToSite} activeOpacity={0.85}>
              <Text style={styles.siteButtonText}>Mağazaya Git</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={toggleFavorite} activeOpacity={0.8}>
              <Ionicons name={inCart ? 'star' : 'star-outline'} size={20} color="#16a34a" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={handleShare} activeOpacity={0.8}>
              <Ionicons name="share-social-outline" size={20} color="#444" />
            </TouchableOpacity>
          </View>

          {product.description && (
            <>
              <Text style={styles.sectionTitle}>Ürün Açıklaması</Text>
              <Text style={styles.description}>{product.description}</Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scrollContent: { paddingBottom: 24 },

  backButton: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 12 },

  imageCard: {
    marginHorizontal: 16,
    backgroundColor: '#fafafa',
    borderRadius: 16,
    aspectRatio: 1.1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  placeholder: { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#999' },

  badge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: { color: '#fff', fontSize: 14, fontWeight: '800' },

  content: { padding: 20 },
  brand: { fontSize: 14, fontWeight: '800', color: '#111' },
  title: { fontSize: 18, fontWeight: '700', color: '#1a1625', marginTop: 2 },

  newPrice: { fontSize: 26, fontWeight: '800', color: '#16a34a', marginTop: 12 },
  oldPrice: { fontSize: 12, fontWeight: '600', color: '#dc2626', marginTop: 2 },

  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 18 },
  siteButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#16a34a',
    borderRadius: 14,
    paddingVertical: 15,
  },
  siteButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1625', marginTop: 24, marginBottom: 8 },
  description: { fontSize: 13, color: '#777', lineHeight: 20 },
})