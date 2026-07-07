import { View, useWindowDimensions } from 'react-native'
import { Product } from '../types/product'
import ProductCard from './ProductCard'

type Props = {
  products: Product[] // ürün dizisi, birden fazla ürün
}

export default function ProductList({ products }: Props) {
  const { width } = useWindowDimensions() // ekran genişliğini alır
  const cardWidth = (width - 24) / 2 // 2 sütun, kenar boşlukları için 24 çıkardık

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 8 }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} cardWidth={cardWidth} />
      ))}
    </View>
  )
}