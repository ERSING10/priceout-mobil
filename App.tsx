import { useEffect } from 'react'
import { View, Text } from 'react-native'
import { supabase } from './src/lib/supabase'

export default function App() {
  useEffect(() => {
    // brands tablosundan 1 kayıt çekmeyi dene, RLS izin veriyor mu test et
    async function testConnection() {
      const { data, error } = await supabase.from('brands').select('*').limit(1)
      if (error) {
        console.log('HATA:', error.message)
      } else {
        console.log('BAŞARILI:', data)
      }
    }
    testConnection()
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Supabase test ediliyor, terminale bak</Text>
    </View>
  )
}