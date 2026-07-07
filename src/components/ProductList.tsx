import { View, ScrollView, useWindowDimensions } from 'react-native'
import { Product } from '../types/product'
import ProductCard from './ProductCard'

type Props = {
  products: Product[]
}

export default function ProductList({ products }: Props) {
  const { width } = useWindowDimensions()
  const cardWidth = (width - 24) / 2

  return (
    <ScrollView>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 8 }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} cardWidth={cardWidth} />
        ))}
      </View>
    </ScrollView>
  )
}