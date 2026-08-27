import { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { supabase } from '../lib/supabase'
import { Brand } from '../types/product'
import BrandCard from '../components/BrandCard'

export default function BrandsListScreen() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigation = useNavigation<any>()

  useEffect(() => {
    fetchBrands()
  }, [])

  async function fetchBrands() {
    const { data, error } = await supabase.from('brands').select('*').order('name')

    if (error) {
      setError('Markalar yüklenemedi, internet bağlantını kontrol et')
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

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
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
  errorText: { color: '#999', fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
  grid: { padding: 16, backgroundColor: '#fafafa' },
})