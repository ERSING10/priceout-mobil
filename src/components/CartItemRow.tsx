import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Product } from '../types/product'

type Props = {
  product: Product
  brandName: string
  onRemove: () => void
  isLast: boolean
}

export default function CartItemRow({ product, brandName, onRemove, isLast }: Props) {
  const navigation = useNavigation<any>()

  function formatPrice(price: number) {
    return price.toLocaleString('tr-TR')
  }

  function handleGoToSite() {
    navigation.navigate('ProductWebView', { url: product.affiliate_link })
  }

  return (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowDivider]}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('ProductDetail', { product, fromCart: true, brandName })}
    >
      {product.image_url ? (
        <Image source={{ uri: product.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}

      <View style={styles.info}>
        <Text style={styles.brandName}>{brandName}</Text>
        <Text style={styles.title} numberOfLines={1}>{product.title}</Text>
        <Text style={styles.newPrice}>{formatPrice(product.discounted_price)}₺</Text>
        {product.original_price > product.discounted_price && (
          <Text style={styles.oldPrice}>Önceki Fiyat: {formatPrice(product.original_price)}₺</Text>
        )}
      </View>

      <View style={styles.siteCol}>
        <TouchableOpacity style={styles.siteCircle} onPress={handleGoToSite} activeOpacity={0.8}>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.siteText}>Siteye Git</Text>
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={onRemove} hitSlop={8}>
        <Ionicons name="close" size={16} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },

  image: { width: 64, height: 64, borderRadius: 10, backgroundColor: '#f5f5f5' },
  placeholder: { backgroundColor: '#eee' },

  info: { flex: 1, marginLeft: 12, marginRight: 6 },
  brandName: { fontSize: 13, fontWeight: '700', color: '#111' },
  title: { fontSize: 12, color: '#999', marginTop: 2 },
  newPrice: { fontSize: 16, fontWeight: '800', color: '#16a34a', marginTop: 4 },
  oldPrice: { fontSize: 10, color: '#dc2626', marginTop: 1 },

  siteCol: { alignItems: 'center' },
  siteCircle: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: '#16a34a',
    justifyContent: 'center', alignItems: 'center',
  },
  siteText: { fontSize: 9, color: '#666', marginTop: 4, fontWeight: '600' },

  closeButton: { position: 'absolute', top: 8, right: 8 },
})