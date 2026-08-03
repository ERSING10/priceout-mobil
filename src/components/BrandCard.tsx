import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Brand } from '../types/product'

type Props = {
  brand: Brand
  onPress: () => void
}

export default function BrandCard({ brand, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}
    >
      <View style={styles.logoBox}>
        {brand.logo_url ? (
          <Image source={{ uri: brand.logo_url }} style={styles.logo} resizeMode="contain" />
        ) : (
          <Text style={styles.placeholderText}>{brand.name[0].toUpperCase()}</Text>
        )}
      </View>

      <Text style={styles.name}>{brand.name}</Text>

      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  rowPressed: { backgroundColor: '#fafafa', transform: [{ scale: 0.98 }] },

  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f7f7f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  logo: { width: 34, height: 34 },
  placeholderText: { fontSize: 18, fontWeight: '700', color: '#999' },

  name: { flex: 1, fontSize: 15, fontWeight: '700', color: '#1a1625' },
})