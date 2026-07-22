import { useEffect, useState } from 'react'
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { supabase } from '../lib/supabase'
import { Brand } from '../types/product'
import BrandCard from '../components/BrandCard'

export default function BrandsListScreen() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation<any>() // ekranlar arası geçiş için

  useEffect(() => {
    fetchBrands()
  }, [])

  async function fetchBrands() {
    const { data, error } = await supabase.from('brands').select('*').order('name')

    if (error) {
      console.log('HATA:', error.message)
    } else {
      setBrands(data)
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

  return (
    <ScrollView contentContainerStyle={styles.grid}>
      {brands.map((brand) => (
        <BrandCard
          key={brand.id}
          brand={brand}
          onPress={() => navigation.navigate('BrandProducts', { brandId: brand.id, brandName: brand.name })}
        />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '3.5%', padding: 16, backgroundColor: '#f5f5f5' },
})