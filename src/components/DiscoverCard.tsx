import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native'
import { Product } from '../types/product'

const { width } = Dimensions.get('window')

type Props = {
  product: Product
  brandName: string
}

export default function DiscoverCard({ product, brandName }: Props) {
  const navigation = useNavigation<NavigationProp<ParamListBase>>()

  const formatPrice = (price: number) => {
    return price.toLocaleString('tr-TR')
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ProductDetail', { product })}
      style={styles.cardContainer}
    >
      <View style={styles.imageWrapper}>
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]} />
        )}
        
        {product.discount_rate > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>%{product.discount_rate}</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.brandName}>{brandName}</Text>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.newPrice}>
            {formatPrice(product.discounted_price)}<Text style={styles.currencySymbol}>₺</Text>
          </Text>
          {product.original_price > product.discounted_price && (
            <Text style={styles.oldPrice}>
              Önceki Fiyat: {formatPrice(product.original_price)}₺
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.85,
    backgroundColor: '#e6e6e6', 
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1.05, 
    backgroundColor: '#fff', 
    borderRadius: 16,
    overflow: 'hidden', 
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: '#f9f9f9',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#00a82d', 
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  infoContainer: {
    marginTop: 16,
  },
  brandName: {
    color: '#000',
    fontWeight: '800',
    fontSize: 15,
  },
  title: {
    color: '#111',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 4,
  },
  priceContainer: {
    marginTop: 10,
  },
  newPrice: {
    fontSize: 34,
    fontWeight: '800',
    color: '#00a82d',
    letterSpacing: -1,
  },
  currencySymbol: {
    fontSize: 28, 
  },
  oldPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#cc0000', 
    marginTop: 2,
  },
})