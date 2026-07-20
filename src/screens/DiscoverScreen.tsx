import { useEffect, useState } from 'react'
import { View, FlatList, Dimensions, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { supabase } from '../lib/supabase'
import { Product, Brand } from '../types/product'
import DiscoverCard from '../components/DiscoverCard'

const { height } = Dimensions.get('window')
const GENDER_FILTERS = ['Tümü', 'Kadın', 'Erkek', 'Unisex'] 

export default function DiscoverScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<Record<string, Brand>>({}) // id'ye göre hızlı erişim için obje
  const [loading, setLoading] = useState(true)
  const [selectedGender, setSelectedGender] = useState('Tümü')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: productsData } = await supabase.from('products').select('*')
    const { data: brandsData } = await supabase.from('brands').select('*')

    if (productsData) setProducts(productsData)

    if (brandsData) {
      // dizi -> id ile erişilebilen obje (her ürün için marka aramayı hızlandırmak için)
      const brandsMap: Record<string, Brand> = {}
      brandsData.forEach((b) => { brandsMap[b.id] = b })
      setBrands(brandsMap)
    }

    setLoading(false)
  }

  const filteredProducts = products.filter((p) => {
    if (selectedGender === 'Tümü') return true
    if (selectedGender === 'Kadın') return p.gender === 'kadin'
    if (selectedGender === 'Erkek') return p.gender === 'erkek'
    if (selectedGender === 'Unisex') return p.gender === 'unisex'
    return true
  })

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DiscoverCard
            product={item}
            brandName={brands[item.brand_id]?.name ?? ''}
            brandLogo={brands[item.brand_id]?.logo_url ?? null}
          />
        )}
        pagingEnabled // her kaydırmada tam bir sonraki karta gecer
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        decelerationRate="fast"
      />

      <View style={styles.filterBar}>
        {GENDER_FILTERS.map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.filterButton, selectedGender === g && styles.filterButtonActive]}
            onPress={() => setSelectedGender(g)}
          >
            <Text style={[styles.filterText, selectedGender === g && styles.filterTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  filterBar: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  filterButtonActive: { backgroundColor: '#fff' },
  filterText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#000' },
})