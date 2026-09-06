import { View, StyleSheet, Dimensions } from 'react-native'
import { Product, Brand } from '../types/product'
import ProductCard from './ProductCard'

const { width } = Dimensions.get('window')
const CARD_WIDTH_LEFT = (width - 34) * 0.42
const CARD_WIDTH_RIGHT = (width - 34) * 0.52

type Props = {
  shoes: Product[]
  clothes: Product[]
  brands?: Record<string, Brand>
}

export default function SplitCategoryGrid({ shoes, clothes, brands }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        {shoes.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            cardWidth={CARD_WIDTH_LEFT}
            brandName={brands?.[product.brand_id]?.name}
          />
        ))}
      </View>
      <View style={styles.rightCol}>
        {clothes.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            cardWidth={CARD_WIDTH_RIGHT}
            brandName={brands?.[product.brand_id]?.name}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', paddingHorizontal: 12, gap: 10 },
  leftCol: { width: CARD_WIDTH_LEFT },
  rightCol: { width: CARD_WIDTH_RIGHT },
})