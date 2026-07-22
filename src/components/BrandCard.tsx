import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { Brand } from '../types/product'

type Props = {
  brand: Brand
  onPress: () => void
}

export default function BrandCard({ brand, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.logoWrapper}>
        {brand.logo_url ? (
          <Image source={{ uri: brand.logo_url }} style={styles.logo} resizeMode="contain" />
        ) : (
          <View style={[styles.logo, styles.placeholder]}>
            <Text style={styles.placeholderText}>{brand.name[0].toUpperCase()}</Text>
          </View>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>{brand.name}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: { width: '23%', alignItems: 'center', marginBottom: 20 },
  pressed: { opacity: 0.6, transform: [{ scale: 0.94 }] },

  logoWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  logo: { width: 44, height: 44 },
  placeholder: { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 20, fontWeight: '700', color: '#999' },

  name: { fontSize: 12, fontWeight: '600', color: '#333', textAlign: 'center' },
})