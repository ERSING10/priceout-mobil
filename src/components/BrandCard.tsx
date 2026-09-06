import { View, Image, StyleSheet, Pressable, Dimensions } from 'react-native'
import { Brand } from '../types/product'

const { width } = Dimensions.get('window')
const GAP = 4
const CARD_SIZE = (width - 8 * 2 - GAP) / 2 

type Props = {
  brand: Brand
  onPress: () => void
}

export default function BrandCard({ brand, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      {brand.logo_url ? (
        <Image source={{ uri: brand.logo_url }} style={styles.logo} resizeMode="contain" />
      ) : (
        <View style={styles.placeholder} />
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: GAP,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPressed: { backgroundColor: '#f7f7f7', transform: [{ scale: 0.97 }] },
  logo: { width: '60%', height: '60%' },
  placeholder: { width: '60%', height: '60%', backgroundColor: '#f0f0f0', borderRadius: 8 },
})