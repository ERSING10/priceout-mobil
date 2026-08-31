import { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../lib/supabase'

export default function PersonalInfoScreen() {
  const navigation = useNavigation<any>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('profiles')
      .select('username, full_name, phone')
      .eq('id', session.user.id)
      .single()

    if (data) {
      setUsername(data.username || '')
      setPhone(data.phone || '')
      const parts = (data.full_name || '').split(' ')
      setFirstName(parts[0] || '')
      setLastName(parts.slice(1).join(' ') || '')
    }
    setLoading(false)
  }

  async function handleSave() {
    if (!username.trim() || !firstName.trim() || !lastName.trim()) {
      Alert.alert('Hata', 'Kullanıcı adı, ad ve soyad boş bırakılamaz!')
      return
    }

    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        username: username.trim(),
        full_name: `${firstName.trim()} ${lastName.trim()}`,
        phone: phone.trim(),
      })
      .eq('id', session.user.id)

    setSaving(false)

    if (error) {
      Alert.alert('Güncellenemedi', error.message)
      return
    }

    Alert.alert('Başarılı', 'Bilgilerin güncellendi', [
      { text: 'Tamam', onPress: () => navigation.goBack() },
    ])
  }

  function handleDeleteAccount() {
    Alert.alert(
      'Hesabımı Sil',
      'Bu işlem geri alınamaz, hesabın kalıcı olarak silinecek. Emin misin?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            Alert.alert('Bilgi', 'Hesap silme işlemi için destek ekibiyle iletişime geç')
          },
        },
      ]
    )
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarWrapper}>
        <Ionicons name="person" size={54} color="#aaa" />
        <View style={styles.editBadge}>
          <Ionicons name="checkmark" size={12} color="#fff" />
        </View>
      </View>

      <Text style={styles.label}>Kullanıcı Adı</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="@username" placeholderTextColor="#999" autoCapitalize="none" />

      <Text style={styles.label}>Ad</Text>
      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="Ad" placeholderTextColor="#999" />

      <Text style={styles.label}>Soyad</Text>
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Soyad" placeholderTextColor="#999" />

      <Text style={styles.label}>Telefon Numarası</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+90 000 000 00 00" placeholderTextColor="#999" keyboardType="phone-pad" />

      <Text style={styles.consentText}>E-posta izni: Kampanya, indirim ve yeni ürün duyurularının e-posta adresime gönderilmesini onaylıyorum.</Text>
      <Text style={styles.consentText}>SMS izni: Fırsatlar ve özel tekliflerle ilgili SMS bildirimlerini almayı kabul ediyorum.</Text>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveButtonText}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Ionicons name="trash-outline" size={16} color="#dc2626" />
        <Text style={styles.deleteButtonText}>Hesabımı Sil</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, alignItems: 'center' },

  avatarWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  label: { width: '100%', fontSize: 12, fontWeight: '600', color: '#888', marginBottom: 4, marginTop: 10 },
  input: { width: '100%', backgroundColor: '#f5f5f5', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#111' },

  consentText: { width: '100%', fontSize: 11, color: '#999', marginTop: 10, lineHeight: 15 },

  saveButton: { width: '100%', backgroundColor: '#16a34a', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  deleteButton: { flexDirection: 'row', alignItems: 'center', gap: 6, width: '100%', backgroundColor: '#f5f5f5', borderRadius: 10, paddingVertical: 14, justifyContent: 'center', marginTop: 10 },
  deleteButtonText: { color: '#dc2626', fontWeight: '700', fontSize: 14 },
})