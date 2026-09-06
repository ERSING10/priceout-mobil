import { useState, useCallback } from 'react'
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../lib/supabase'
import { Product, Brand } from '../types/product'
import { getCartIds, removeFromCart } from '../lib/cart'
import CartItemRow from '../components/CartItemRow'
import EmptyState from '../components/EmptyState'
import TopBar from '../components/TopBar'

export default function CartScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<Record<string, Brand>>({})
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

    const { data, error } = await supabase.from('products').select('*').in('id', ids)
    const { data: brandsData } = await supabase.from('brands').select('*')

    if (error) {
      setError('Ürünler yüklenemedi, internet bağlantını kontrol et')
    } else {
      setProducts(data)
    }

    if (brandsData) {
      const brandsMap: Record<string, Brand> = {}
      brandsData.forEach((b) => { brandsMap[b.id] = b })
      setBrands(brandsMap)
    }

    setLoading(false)
  }

  async function handleRemove(productId: string) {
    await removeFromCart(productId)
    setProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  function formatPrice(price: number) {
    return price.toLocaleString('tr-TR')
  }

  // brand_id'ye göre grupla
  const groupsMap: Record<string, Product[]> = {}
  products.forEach((p) => {
    if (!groupsMap[p.brand_id]) groupsMap[p.brand_id] = []
    groupsMap[p.brand_id].push(p)
  })
  const groups = Object.entries(groupsMap).map(([brandId, items]) => ({
    brandId,
    brandName: brands[brandId]?.name ?? 'Diğer',
    items,
  }))

  const subtotal = products.reduce((sum, p) => sum + p.original_price, 0)
  const discountAmount = products.reduce((sum, p) => sum + (p.original_price - p.discounted_price), 0)
  const total = products.reduce((sum, p) => sum + p.discounted_price, 0)

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />

      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color="#1a1625" />
        </TouchableOpacity>
        <Text style={styles.title}>Favorilerim</Text>
      </View>

      {loading ? (
        <View style={styles.centered}><ActivityIndicator size="large" /></View>
      ) : error ? (
        <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>
      ) : products.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Favorilerin boş"
          subtitle="Beğendiğin ürünleri favorilere ekleyip burada takip edebilirsin"
          buttonText="Keşfet'e Git"
          onButtonPress={() => navigation.getParent()?.navigate('Discover')}
        />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {groups.map((group) => (
              <View key={group.brandId} style={styles.groupCard}>
                <View style={styles.groupHeader}>
                  <Text style={styles.groupHeaderText}>Mağaza: {group.brandName}</Text>
                </View>
                {group.items.map((product, index) => (
                  <CartItemRow
                    key={product.id}
                    product={product}
                    brandName={group.brandName}
                    onRemove={() => handleRemove(product.id)}
                    isLast={index === group.items.length - 1}
                  />
                ))}
              </View>
            ))}
          </ScrollView>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ara Toplam:</Text>
              <Text style={styles.summaryValue}>{formatPrice(subtotal)} ₺</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>İndirim Miktarı:</Text>
              <Text style={styles.summaryValue}>{formatPrice(discountAmount)} ₺</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Toplam:</Text>
              <Text style={styles.totalValue}>{formatPrice(total)} ₺</Text>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#999', fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },

  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, marginTop: 4, marginBottom: 10 },
  title: { fontSize: 20, fontWeight: '800', color: '#1a1625' },

  scrollContent: { padding: 16, paddingBottom: 8 },

  groupCard: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  groupHeader: { backgroundColor: '#16a34a', paddingVertical: 8, paddingHorizontal: 14 },
  groupHeaderText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  summary: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  summaryLabel: { fontSize: 13, color: '#555' },
  summaryValue: { fontSize: 13, color: '#555', fontWeight: '600' },
  totalLabel: { fontSize: 16, fontWeight: '800', color: '#16a34a', marginTop: 4 },
  totalValue: { fontSize: 16, fontWeight: '800', color: '#16a34a', marginTop: 4 },
})