import { useState, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useNavigation, useFocusEffect, NavigationProp, ParamListBase } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../lib/supabase'

type Profile = {
  full_name: string | null
  username: string | null
  email: string | null
}

export default function AccountScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)

  useFocusEffect(
    useCallback(() => {
      checkSession()
    }, [])
  )

  async function checkSession() {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      setProfile(null)
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('profiles')
      .select('full_name, username, email')
      .eq('id', session.user.id)
      .single()

    setProfile(data)
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    checkSession()
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    )
  }

  // MİSAFİR MODU
  if (!profile) {
    return (
      <View style={styles.guestContainer}>
        <View style={styles.avatarWrapper}>
          <Ionicons name="person" size={54} color="#aaa" />
        </View>
        <Text style={styles.guestText}>Misafir Kullanıcı</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('SignUp')} activeOpacity={0.8}>
          <Text style={styles.primaryButtonText}>Üye Ol</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Login')} activeOpacity={0.8}>
          <Text style={styles.secondaryButtonText}>Giriş Yap</Text>
        </TouchableOpacity>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialIcon} activeOpacity={0.7}>
            <Ionicons name="logo-google" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon} activeOpacity={0.7}>
            <Ionicons name="logo-apple" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.contactButton} activeOpacity={0.7} onPress={() => navigation.navigate('ContactSupport')}>
          <Ionicons name="help-circle-outline" size={16} color="#444" />
          <Text style={styles.contactButtonText}>İletişim & Destek</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // ÜYE MODU
  const menuItems = [
    { label: 'Kişisel Bilgilerim', icon: 'person-outline', screen: 'PersonalInfo' },
    { label: 'Bildirim Ayarları', icon: 'notifications-outline', screen: null },
    { label: 'Şifre Değiştir', icon: 'lock-closed-outline', screen: 'ChangePassword' },
    { label: 'E-Posta Değişikliği', icon: 'mail-outline', screen: 'ChangeEmail' },
    { label: 'İletişim & Destek', icon: 'help-circle-outline', screen: 'ContactSupport' }, 
  ]

  return (
    <ScrollView 
      style={styles.baseContainer} 
      contentContainerStyle={styles.memberContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.avatarWrapper}>
        <Ionicons name="person" size={54} color="#aaa" />
      </View>
      <Text style={styles.memberName}>{profile.full_name || 'İsim Soyisim'}</Text>
      {profile.username && <Text style={styles.memberUsername}>@{profile.username}</Text>}

      <View style={styles.menuList}>
        {menuItems.map((item) => (
        <TouchableOpacity
            key={item.label}
            style={styles.menuItem}
            onPress={() => item.screen && navigation.navigate(item.screen)}
            activeOpacity={0.7}
        >
            <Ionicons name={item.icon as any} size={18} color="#444" />
            <Text style={styles.menuItemText}>{item.label}</Text>
        </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  baseContainer: { flex: 1, backgroundColor: '#fff' },
  guestContainer: { flex: 1, backgroundColor: '#fff', alignItems: 'center', paddingTop: 24 },
  memberContent: { alignItems: 'center', paddingTop: 24, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },

  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  guestText: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 20 },
  memberName: { fontSize: 18, fontWeight: '700', color: '#1a1625', marginTop: 4 },
  memberUsername: { fontSize: 14, color: '#888', marginTop: 2, marginBottom: 20 },

  primaryButton: { backgroundColor: '#16a34a', borderRadius: 10, paddingVertical: 14, width: '85%', alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  secondaryButton: { backgroundColor: '#f0f0f0', borderRadius: 10, paddingVertical: 14, width: '85%', alignItems: 'center', marginBottom: 20 },
  secondaryButtonText: { color: '#444', fontWeight: '700', fontSize: 15 },

  socialRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  socialIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },

  contactButton: {
    position: 'absolute',
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#eaeaea',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff'
  },
  contactButtonText: { fontSize: 13, color: '#555', fontWeight: '600' },

  menuList: { width: '100%', paddingHorizontal: 20, marginTop: 8 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 10,
  },
  menuItemText: { fontSize: 15, color: '#333', fontWeight: '600' },

  logoutButton: { width: '85%', backgroundColor: '#16a34a', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  logoutText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})