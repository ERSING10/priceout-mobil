import 'react-native-url-polyfill/auto' // RN'de URL API'si yok, polyfill sağlıyor
import { createClient } from '@supabase/supabase-js'
import 'expo-sqlite/localStorage/install' // global localStorage'ı SQLite ile enjekte ediyor

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,       // artık expo-sqlite bunu sağlıyor
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})