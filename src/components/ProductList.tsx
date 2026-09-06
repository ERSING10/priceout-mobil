import { View, useWindowDimensions } from 'react-native'
import { Product, Brand } from '../types/product'
import ProductCard from './ProductCard'

type Props = {
  products: Product[]
  brands?: Record<string, Brand>
}

export default function ProductList({ products, brands }: Props) {
  const { width } = useWindowDimensions()
  const cardWidth = (width - 24) / 2

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 8 }}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          cardWidth={cardWidth}
          brandName={brands?.[product.brand_id]?.name}
        />
      ))}
    </View>
  )
}