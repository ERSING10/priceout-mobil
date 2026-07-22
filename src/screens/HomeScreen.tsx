import { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { supabase } from '../lib/supabase'
import { Product } from '../types/product'
import SearchBar from '../components/SearchBar'
import CategoryBar from '../components/CategoryBar'
import ProductList from '../components/ProductList'
import SkeletonGrid from '../components/SkeletonGrid'

export default function HomeScreen() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: featured } = await supabase.from('products').select('*').eq('is_featured', true)
    const { data: all } = await supabase.from('products').select('*')

    if (featured) setFeaturedProducts(featured)
    if (all) setAllProducts(all)
    setLoading(false)
  }

  // kategori seçiliyse tüm ürünler içinden o kategori, seçili değilse öne çıkanlar
  const displayedProducts = selectedCategory === ''
    ? featuredProducts
    : allProducts.filter((p) => p.category === selectedCategory)

  if (loading) {
    return (
      <ScrollView style={styles.container}>
        <SearchBar />
        <CategoryBar selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
        <SkeletonGrid />
      </ScrollView>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <SearchBar />
      <CategoryBar selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
      <ProductList products={displayedProducts} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})