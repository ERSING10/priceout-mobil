import { useEffect, useState } from 'react'
import {
  View, Text, FlatList, ActivityIndicator, StyleSheet,
  SafeAreaView, Platform, StatusBar, TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../lib/supabase'
import { Brand } from '../types/product'
import BrandCard from '../components/BrandCard'
import TopBar from '../components/TopBar'

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />

      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color="#1a1625" />
        </TouchableOpacity>
        <Text style={styles.title}>Mağazalar</Text>
      </View>

      {loading ? (
        <View style={styles.centered}><ActivityIndicator size="large" /></View>
      ) : error ? (
        <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>
      ) : (
        <FlatList
          data={brands}
          keyExtractor={(b) => b.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <BrandCard
              brand={item}
              onPress={() => navigation.navigate('BrandProducts', { brandId: item.id, brandName: item.name })}
            />
          )}
        />
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

  grid: { paddingHorizontal: 8, paddingTop: 4, paddingBottom: 16 },
  row: { justifyContent: 'space-between', marginBottom: 4 },
})