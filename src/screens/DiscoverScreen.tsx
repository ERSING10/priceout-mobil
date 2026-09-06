import { useEffect, useState } from 'react'
import { View, FlatList, ActivityIndicator, StyleSheet, Text, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native'
import { supabase } from '../lib/supabase'
import { Product, Brand } from '../types/product'
import DiscoverCard from '../components/DiscoverCard'

const GENDER_FILTERS = ['Erkek', 'Kadın']

export default function DiscoverScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<Record<string, Brand>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedGender, setSelectedGender] = useState('Kadın')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    
    const { data: brandsData, error: brandsError } = await supabase.from('brands').select('*')

    if (productsError || brandsError) {
      setError('Ürünler yüklenemedi, bağlantını kontrol et')
      setLoading(false)
      return
    }

    if (productsData) setProducts(productsData)

    if (brandsData) {
      const brandsMap: Record<string, Brand> = {}
      brandsData.forEach((b) => { brandsMap[b.id] = b })
      setBrands(brandsMap)
    }

    setLoading(false)
  }

  const filteredProducts = products.filter((p) => {
    if (selectedGender === 'Kadın') return p.gender === 'kadin'
    if (selectedGender === 'Erkek') return p.gender === 'erkek'
    return true
  })

  // Tasarım renkleri
  const GREEN_COLOR = '#00a82d'

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={GREEN_COLOR} />
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.logoText}>yüzde<Text style={{ color: GREEN_COLOR, fontSize: 32 }}>50</Text></Text>
        </View>

        <View style={styles.filterWrapper}>
          <View style={styles.filterBar}>
            {GENDER_FILTERS.map((g) => {
              const isActive = selectedGender === g
              return (
                <TouchableOpacity
                  key={g}
                  style={[styles.filterButton, isActive && styles.filterButtonActive]}
                  onPress={() => setSelectedGender(g)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DiscoverCard
              product={item}
              brandName={brands[item.brand_id]?.name ?? ''}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f1f1f1',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  container: { 
    flex: 1, 
    backgroundColor: '#f1f1f1' 
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f1f1f1' 
  },
  errorText: { 
    color: '#999', 
    fontSize: 14, 
    textAlign: 'center', 
    paddingHorizontal: 32 
  },

  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  logoText: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: '#000',
    includeFontPadding: false,
    textAlignVertical: 'center'
  },

  filterWrapper: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: '#ddd', 
    borderRadius: 8,
    padding: 2,
    width: 200, 
  },
  filterButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  filterButtonActive: { 
    backgroundColor: '#00a82d' 
  },
  filterText: { 
    color: '#00a82d', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  filterTextActive: { 
    color: '#fff' 
  },

  listContent: {
    alignItems: 'center',
    paddingBottom: 20,
  }
})