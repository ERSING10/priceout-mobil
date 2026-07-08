import { useEffect, useState } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { supabase } from '../lib/supabase'
import { Product } from '../types/product'
import ProductList from '../components/ProductList'

export default function BrandProductsScreen() {
  const route = useRoute<any>()
  const { brandId } = route.params // BrandsListScreen'den gönderilen parametreyi al

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBrandProducts()
  }, [])

  async function fetchBrandProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('brand_id', brandId) // sadece bu markanın ürünleri

    if (error) {
      console.log('HATA:', error.message)
    } else {
      setProducts(data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return <ProductList products={products} />
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})