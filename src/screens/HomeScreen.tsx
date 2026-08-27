import { useEffect, useState } from 'react'
import { View, ActivityIndicator, StyleSheet, ScrollView, Text } from 'react-native'
import { supabase } from '../lib/supabase'
import { Product } from '../types/product'
import SearchBar from '../components/SearchBar'
import CategoryBar from '../components/CategoryBar'
import ProductList from '../components/ProductList'
import SplitCategoryGrid from '../components/SplitCategoryGrid'

export default function HomeScreen() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: all, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      setError('Ürünler yüklenemedi, internet bağlantını kontrol et')
    } else if (all) {
      setAllProducts(all)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <ScrollView style={styles.container}>
        <SearchBar />
        <CategoryBar selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      </ScrollView>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <SearchBar />
      <CategoryBar selectedCategory={selectedCategory} onSelect={setSelectedCategory} />

      {selectedCategory === '' ? (
        <SplitCategoryGrid
          shoes={allProducts.filter((p) => p.category === 'Ayakkabı')}
          clothes={allProducts.filter((p) => p.category === 'Giyim')}
        />
      ) : (
        <ProductList products={allProducts.filter((p) => p.category === selectedCategory)} />
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 },
  errorText: { color: '#999', fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
})