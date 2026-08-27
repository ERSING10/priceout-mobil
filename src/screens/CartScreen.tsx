import { useState, useCallback } from 'react'
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { supabase } from '../lib/supabase'
import { Product } from '../types/product'
import { getCartIds } from '../lib/cart'
import ProductCard from '../components/ProductCard'
import EmptyState from '../components/EmptyState'

export default function CartScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigation = useNavigation<any>()

  useFocusEffect(
    useCallback(() => {
      fetchCartProducts()
    }, [])
  )

  async function fetchCartProducts() {
    setLoading(true)
    setError('')
    const ids = await getCartIds()

    if (ids.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('id', ids)

    if (error) {
      setError('Ürünler yüklenemedi, internet bağlantını kontrol et')
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

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon="cart-outline"
        title="Sepetin boş"
        subtitle="Beğendiğin ürünleri sepete ekleyip burada takip edebilirsin"
        buttonText="Keşfet'e Git"
        onButtonPress={() => navigation.getParent()?.navigate('Discover')}
      />
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
  errorText: { color: '#999', fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 12 },
})