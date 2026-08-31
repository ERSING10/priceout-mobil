import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../lib/supabase'

export default function SignUpScreen() {
  const navigation = useNavigation<any>()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptKvkk, setAcceptKvkk] = useState(false)
  const [acceptEmailCampaign, setAcceptEmailCampaign] = useState(false)
  const [acceptSmsCampaign, setAcceptSmsCampaign] = useState(false)

  const [loading, setLoading] = useState(false)

  async function handleSignUp() {
    if (!firstName || !lastName || !username || !email || !password) {
      Alert.alert('Eksik bilgi', 'Lütfen zorunlu alanları doldur')
      return
    }
    if (!acceptTerms || !acceptKvkk) {
      Alert.alert('Onay gerekli', 'Üyelik Sözleşmesi ve KVKK metnini onaylaman gerekiyor')
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`,
        },
      },
    })

    if (error) {
      Alert.alert('Kayıt başarısız', error.message)
      setLoading(false)
      return
    }

    if (!data.user) {
      Alert.alert('Kayıt başarısız', 'Kullanıcı oluşturulamadı')
      setLoading(false)
      return
    }

    // trigger zaten temel profili (full_name, role, email) oluşturdu
    // burada sadece eksik kalan alanları (username, phone) güncelliyoruz
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ username, phone })
      .eq('id', data.user.id)

    setLoading(false)

    if (profileError) {
      Alert.alert('Profil güncellenemedi', profileError.message)
      return
    }

    Alert.alert('Başarılı', 'Kayıt tamamlandı', [
      { text: 'Tamam', onPress: () => navigation.navigate('Account') },
    ])
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="Ad" placeholderTextColor="#999" />
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Soyad" placeholderTextColor="#999" />
      <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="@username" placeholderTextColor="#999" autoCapitalize="none" />
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+90 000 000 00 00" placeholderTextColor="#999" keyboardType="phone-pad" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="xxxx@xxx.com" placeholderTextColor="#999" autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Şifre" placeholderTextColor="#999" secureTextEntry />
      <CheckboxRow
        checked={acceptTerms}
        onPress={() => setAcceptTerms(!acceptTerms)}
        text="Üyelik Sözleşmesi koşullarını kabul ediyorum."
        required
      />
      <CheckboxRow
        checked={acceptKvkk}
        onPress={() => setAcceptKvkk(!acceptKvkk)}
        text="KVKK Aydınlatma Metni kapsamında kişisel verilerimin işlenmesini onaylıyorum."
        required
      />
      <CheckboxRow
        checked={acceptEmailCampaign}
        onPress={() => setAcceptEmailCampaign(!acceptEmailCampaign)}
        text="Kampanya ve indirimlerle ilgili E-Posta bildirimleri almayı kabul ediyorum."
      />
      <CheckboxRow
        checked={acceptSmsCampaign}
        onPress={() => setAcceptSmsCampaign(!acceptSmsCampaign)}
        text="Kampanya ve indirimlerle ilgili SMS bildirimleri almayı kabul ediyorum."
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Kaydediliyor...' : 'Üye Ol'}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

function CheckboxRow({ checked, onPress, text, required }: { checked: boolean; onPress: () => void; text: string; required?: boolean }) {
  return (
    <TouchableOpacity style={styles.checkboxRow} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={checked ? 'checkbox' : 'square-outline'} size={20} color={checked ? '#16a34a' : '#999'} />
      <Text style={styles.checkboxText}>
        {text} {required && <Text style={styles.requiredText}>(Zorunlu)</Text>}
        {!required && <Text style={styles.optionalText}>(İsteğe Bağlı)</Text>}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, marginBottom: 10, color: '#111' },

  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 10, marginTop: 4 },
  checkboxText: { flex: 1, fontSize: 12, color: '#555', lineHeight: 17 },
  requiredText: { color: '#16a34a', fontWeight: '600' },
  optionalText: { color: '#999' },

  button: { backgroundColor: '#16a34a', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})