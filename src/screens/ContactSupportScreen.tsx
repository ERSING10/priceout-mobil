import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { supabase } from '../lib/supabase'

export default function ContactSupportScreen() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSend() {
    if (!message.trim()) {
      Alert.alert('Hata', 'Mesajını yazmalısın')
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('support_messages').insert({
      user_id: user?.id ?? null,
      email: user?.email ?? null,
      message: message.trim(),
    })

    setLoading(false)

    if (error) {
      Alert.alert('Gönderilemedi', error.message)
      return
    }

    setMessage('')
    Alert.alert('Teşekkürler', 'Mesajın bize ulaştı, en kısa sürede dönüş yapacağız')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.description}>Bir sorunun mu var, önerin mi var? Bize yaz, sana yardımcı olalım.</Text>

      <TextInput
        style={styles.textArea}
        value={message}
        onChangeText={setMessage}
        placeholder="Mesajını buraya yaz..."
        placeholderTextColor="#999"
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      <TouchableOpacity style={styles.button} onPress={handleSend} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Gönderiliyor...' : 'Gönder'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 30 },
  description: { fontSize: 13, color: '#666', marginBottom: 16, lineHeight: 19 },
  textArea: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 14, fontSize: 14, color: '#111', minHeight: 140 },

  button: { backgroundColor: '#16a34a', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})