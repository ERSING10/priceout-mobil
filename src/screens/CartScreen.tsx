import { useState, useCallback } from 'react'
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { supabase } from '../lib/supabase'
import { Product } from '../types/product'
import { getCartIds } from '../lib/favorites'
import ProductCard from '../components/ProductCard'

export default function CartScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // ekran her odaklandığında (sepete girildiğinde) listeyi tazele
  useFocusEffect(
    useCallback(() => {
      fetchCartProducts()
    }, [])
  )

  async function fetchCartProducts() {
    setLoading(true)
    const ids = await getCartIds()

    if (ids.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('id', ids) // id listesindeki tüm ürünleri getir

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

  if (products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Sepetin boş</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} cardWidth={170} fromCart={true} />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#999', fontSize: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 12 },
})