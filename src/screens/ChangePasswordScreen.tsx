import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../lib/supabase'

export default function ChangePasswordScreen() {
  const navigation = useNavigation<any>()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const hasMinLength = newPassword.length >= 6
  const hasLetter = /[a-zA-Z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)

  async function handleChangePassword() {
    if (!currentPassword) {
      Alert.alert('Hata', 'Mevcut şifreni girmelisin')
      return
    }
    if (!hasMinLength || !hasLetter || !hasNumber) {
      Alert.alert('Geçersiz şifre', 'Şifre gereksinimlerini karşılamıyor')
      return
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Şifreler uyuşmuyor', 'Yeni şifre ve tekrarı aynı olmalı')
      return
    }

    setLoading(true)

    // 1. adım: mevcut şifreyi doğrula (gizlice yeniden giriş denemesi)
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: currentUser?.email || '',
      password: currentPassword,
    })

    if (signInError) {
      setLoading(false)
      Alert.alert('Hata', 'Mevcut şifrenizi yanlış girdiniz!')
      return
    }

    // 2. adım: mevcut şifre doğruysa yeni şifreyi güncelle
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setLoading(false)

    if (error) {
      Alert.alert('Şifre değiştirilemedi', error.message)
      return
    }

    Alert.alert('Başarılı', 'Şifren güncellendi', [
      { text: 'Tamam', onPress: () => navigation.goBack() },
    ])
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Mevcut Şifre"
        placeholderTextColor="#999"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Yeni Şifre"
        placeholderTextColor="#999"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Yeni Şifre Tekrar"
        placeholderTextColor="#999"
        secureTextEntry
      />

      <View style={styles.rulesBox}>
        <RuleRow ok={hasMinLength} text="En az 6 karakter içermelidir." />
        <RuleRow ok={hasLetter} text="En az 1 harf içermelidir." />
        <RuleRow ok={hasNumber} text="En az 1 rakam içermelidir." />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Kaydediliyor...' : 'Kaydet'}</Text>
      </TouchableOpacity>
    </View>
  )
}

function RuleRow({ ok, text }: { ok: boolean; text: string }) {
  return (
    <View style={styles.ruleRow}>
      <Ionicons name={ok ? 'checkmark-circle' : 'close-circle'} size={14} color={ok ? '#16a34a' : '#dc2626'} />
      <Text style={[styles.ruleText, { color: ok ? '#16a34a' : '#dc2626' }]}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 30 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, marginBottom: 10, color: '#111' },

  rulesBox: { marginTop: 8, gap: 4 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ruleText: { fontSize: 12 },

  button: { backgroundColor: '#16a34a', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})