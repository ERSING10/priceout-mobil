import { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Product } from '../types/product'

const { width, height } = Dimensions.get('window')
const CARD_WIDTH = width - 32 // sağ-sol 16'şar boşluk
const CARD_HEIGHT = CARD_WIDTH // kare kart

type Props = {
  product: Product
  brandName: string
  brandLogo: string | null
}

export default function DiscoverCard({ product, brandName, brandLogo }: Props) {
  const navigation = useNavigation<any>()
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!product.deal_ends_at) return

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(product.deal_ends_at!))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  function calculateTimeLeft(endsAt: string): string {
    const diff = new Date(endsAt).getTime() - new Date().getTime()
    if (diff <= 0) return ''
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}s ${minutes}dk`
  }

  const savings = product.original_price - product.discounted_price

  return (
    <View style={styles.page}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.95}
        onPress={() => navigation.navigate('ProductDetail', { product })}
      >
        <View style={styles.imageWrapper}>
          {product.image_url ? (
            <Image source={{ uri: product.image_url }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholder]} />
          )}

          <View style={styles.topRow}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>%{product.discount_rate}</Text>
            </View>

            {timeLeft !== '' && (
              <View style={styles.timeBadge}>
                <Text style={styles.timeBadgeText}>{timeLeft}</Text>
              </View>
            )}
          </View>

          {product.stock_count !== null && product.stock_count <= 5 && (
            <View style={styles.stockBadge}>
              <Text style={styles.stockBadgeText}>Son {product.stock_count} adet</Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
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
            <Text style={styles.oldPrice}>{product.original_price} ₺</Text>
            <Text style={styles.savings}>{savings} ₺ kazanç</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { width, height, justifyContent: 'center', alignItems: 'center' },
  card: { width: CARD_WIDTH, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  imageWrapper: { position: 'relative' },
  image: { width: CARD_WIDTH, height: CARD_HEIGHT },
  placeholder: { backgroundColor: '#eee' },

  topRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  discountBadge: { backgroundColor: '#ff5722', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  discountBadgeText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  timeBadge: { backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  timeBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  stockBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(220,38,38,0.9)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stockBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },

  info: { padding: 16 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  brandLogo: { width: 22, height: 22, borderRadius: 11 },
  brandLogoPlaceholder: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#ddd' },
  brandName: { color: '#666', fontWeight: '600', fontSize: 12 },

  title: { color: '#111', fontSize: 17, fontWeight: '700', marginBottom: 8 },

  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' },
  newPrice: { color: '#111', fontSize: 20, fontWeight: '800' },
  oldPrice: { color: '#aaa', fontSize: 14, textDecorationLine: 'line-through' },
  savings: { color: '#16a34a', fontWeight: '700', fontSize: 12 },
})