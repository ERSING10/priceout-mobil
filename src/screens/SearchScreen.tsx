import { useState, useEffect } from 'react'
import { View, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { supabase } from '../lib/supabase'
import { Product } from '../types/product'
import ProductList from '../components/ProductList'
import EmptyState from '../components/EmptyState'

export default function SearchScreen() {
  const navigation = useNavigation<any>()
  const [searchText, setSearchText] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false) // en az bir kere arama yapıldı mı

  useEffect(() => {
  const timer = setTimeout(() => {
    performSearch(searchText)
  }, 400) // kullanıcı 400ms yazmayı durdurursa arama tetiklenir

    return () => clearTimeout(timer) // her yeni harfte, önceki zamanlayıcı iptal edilir
  }, [searchText])

  function handleSearch(text: string) {
    setSearchText(text)
  }

  async function performSearch(text: string) {
    if (text.trim() === '') {
      setResults([])
      setSearched(false)
      return
    }

    setLoading(true)
    setSearched(true)

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('title', `%${text}%`)

    if (error) {
      console.log('HATA:', error.message)
    } else {
      setResults(data)
    }
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <Ionicons name="search" size={18} color="#888" />
          <TextInput
            style={styles.input}
            placeholder="Ürün ara"
            value={searchText}
            onChangeText={handleSearch}
            autoFocus // ekran açılınca klavye otomatik açılsın
          />
        </View>
      </View>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {!loading && searched && results.length === 0 && (
        <EmptyState icon="search-outline" title="Sonuç bulunamadı" subtitle="Farklı bir kelimeyle tekrar dene" />
      )}

      {!loading && results.length > 0 && (
        <ProductList products={results} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, paddingTop: 50 },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  input: { flex: 1, fontSize: 14 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})