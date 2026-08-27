import { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { Product } from '../types/product'
import { getCartIds, addToCart, removeFromCart } from '../lib/cart'

const { width } = Dimensions.get('window')

type Props = {
  product: Product
  brandName: string
  brandLogo: string | null
}

export default function DiscoverCard({ product, brandName, brandLogo }: Props) {
  const navigation = useNavigation<any>()
  const [timeLeft, setTimeLeft] = useState('')
  const [inCart, setInCart] = useState(false)

  useEffect(() => {
    checkIfInCart()
    if (!product.deal_ends_at) return
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(product.deal_ends_at!))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  async function checkIfInCart() {
    const ids = await getCartIds()
    setInCart(ids.includes(product.id))
  }

  async function handleCartPress() {
    if (inCart) {
      await removeFromCart(product.id)
      setInCart(false)
    } else {
      await addToCart(product.id)
      setInCart(true)
    }
  }

  function calculateTimeLeft(endsAt: string): string {
    const diff = new Date(endsAt).getTime() - new Date().getTime()
    if (diff <= 0) return ''
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}s ${minutes}dk`
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => navigation.navigate('ProductDetail', { product })}
      >
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]} />
        )}
      </TouchableOpacity>

      {timeLeft !== '' && (
        <View style={styles.timeBadge}>
          <Text style={styles.timeBadgeText}>{timeLeft}</Text>
        </View>
      )}
      {product.stock_count !== null && product.stock_count <= 5 && (
        <View style={styles.stockBadge}>
          <Text style={styles.stockBadgeText}>Son {product.stock_count} adet</Text>
        </View>
      )}

      <View style={styles.actionColumn}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCartPress}>
          <Ionicons name={inCart ? 'heart' : 'heart-outline'} size={28} color={inCart ? '#dc2626' : '#fff'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="paper-plane-outline" size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ProductWebView', { url: product.affiliate_link })}>
          <Ionicons name="open-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomInfo}>
        <View style={styles.brandRow}>
          {brandLogo ? (
            <Image source={{ uri: brandLogo }} style={styles.brandLogo} />
          ) : (
            <View style={styles.brandLogoPlaceholder} />
          )}
          <Text style={styles.brandName}>{brandName}</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>{product.title}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.newPrice}>{product.discounted_price} ₺</Text>
          {product.original_price > product.discounted_price && (
            <Text style={styles.oldPrice}>{product.original_price} ₺</Text>
          )}
          {product.discount_rate > 0 && (
            <Text style={styles.discount}>%{product.discount_rate}</Text>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { width, marginBottom: 20 },
  image: { width: '100%', height: width },
  placeholder: { backgroundColor: '#222' },

  timeBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  timeBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },

  stockBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(220,38,38,0.9)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stockBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },

  actionColumn: {
    position: 'absolute',
    right: 12,
    bottom: 90,
    alignItems: 'center',
    gap: 20,
  },
  actionButton: { alignItems: 'center' },

  bottomInfo: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 4, backgroundColor: '#fff' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  brandLogo: { width: 22, height: 22, borderRadius: 11 },
  brandLogoPlaceholder: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#eee' },
  brandName: { color: '#1a1625', fontWeight: '700', fontSize: width * 0.035 },

  title: { color: '#1a1625', fontSize: width * 0.038, marginBottom: 6 },

  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  newPrice: { fontSize: 17, fontWeight: '800', color: '#111' },
  oldPrice: { fontSize: 12, color: '#aaa', textDecorationLine: 'line-through' },
  discount: { fontSize: 12, color: '#dc2626', fontWeight: '700' },
})