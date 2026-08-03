import { useEffect, useState } from 'react'
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { supabase } from '../lib/supabase'
import { Product } from '../types/product'
import CategoryBar from '../components/CategoryBar'
import BrandProductRow from '../components/BrandProductRow'
import EmptyState from '../components/EmptyState'

export default function BrandProductsScreen() {
  const route = useRoute<any>()
  const { brandId } = route.params

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchBrandProducts()
  }, [])

  async function fetchBrandProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('brand_id', brandId)

    if (error) {
      console.log('HATA:', error.message)
    } else {
      setProducts(data)
    }
    setLoading(false)
  }

  const displayedProducts = selectedCategory === ''
    ? products
    : products.filter((p) => p.category === selectedCategory)

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <CategoryBar selectedCategory={selectedCategory} onSelect={setSelectedCategory} />

      {displayedProducts.length === 0 ? (
        <EmptyState icon="pricetag-outline" title="Bu kategoride ürün yok" subtitle="Başka bir kategori dene" />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {displayedProducts.map((product) => (
            <BrandProductRow key={product.id} product={product} />
          ))}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
})