import { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { supabase } from '../lib/supabase'

export default function ChangeEmailScreen() {
  const navigation = useNavigation<any>()
  const [currentEmail, setCurrentEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCurrentEmail()
  }, [])

  async function loadCurrentEmail() {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentEmail(user?.email || '')
  }

  async function handleChangeEmail() {
    if (!newEmail.trim() || !password) {
      Alert.alert('Hata', 'Yeni e-posta ve şifreni girmelisin')
      return
    }
    if (newEmail.trim() === currentEmail) {
      Alert.alert('Hata', 'Yeni e-posta mevcut e-postan ile aynı olamaz')
      return
    }

    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: currentEmail,
      password,
    })

    if (signInError) {
      setLoading(false)
      Alert.alert('Hata', 'Şifreni yanlış girdin')
      return
    }

    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() })
    setLoading(false)

    if (error) {
      Alert.alert('E-posta değiştirilemedi', error.message)
      return
    }

    Alert.alert('Başarılı', 'E-posta adresin güncellendi', [
      { text: 'Tamam', onPress: () => navigation.goBack() },
    ])
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mevcut E-Posta</Text>
      <View style={styles.readOnlyInput}>
        <Text style={styles.readOnlyText}>{currentEmail}</Text>
      </View>

      <Text style={styles.label}>Yeni E-Posta</Text>
      <TextInput
        style={styles.input}
        value={newEmail}
        onChangeText={setNewEmail}
        placeholder="yeni@mail.com"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Şifre</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Şifreni doğrula"
        placeholderTextColor="#999"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleChangeEmail} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Kaydediliyor...' : 'Kaydet'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 30 },
  label: { fontSize: 12, fontWeight: '600', color: '#888', marginBottom: 4, marginTop: 10 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#111' },
  readOnlyInput: { backgroundColor: '#eee', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12 },
  readOnlyText: { fontSize: 14, color: '#888' },

  button: { backgroundColor: '#16a34a', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})