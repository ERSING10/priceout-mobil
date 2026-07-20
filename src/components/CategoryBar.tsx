import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

// her kategori için isim + ikon eşleşmesi
const CATEGORIES: { name: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { name: 'Ayakkabı', icon: 'footsteps-outline' },
  { name: 'Çanta', icon: 'bag-handle-outline' },
  { name: 'Giyim', icon: 'shirt-outline' },
  { name: 'Aksesuar', icon: 'glasses-outline' },
  { name: 'Saat', icon: 'watch-outline' },
  { name: 'Elektronik', icon: 'phone-portrait-outline' },
  { name: 'Spor', icon: 'basketball-outline' },
  { name: 'Kozmetik', icon: 'color-palette-outline' },
  { name: 'Ev & Yaşam', icon: 'home-outline' },
  { name: 'Diğer', icon: 'ellipsis-horizontal-outline' },
]

type Props = {
  selectedCategory: string
  onSelect: (category: string) => void
}

export default function CategoryBar({ selectedCategory, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.name}
          style={[styles.box, selectedCategory === cat.name && styles.boxActive]}
          onPress={() => onSelect(selectedCategory === cat.name ? '' : cat.name)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={cat.icon}
            size={22}
            color={selectedCategory === cat.name ? '#fff' : '#444'}
          />
          <Text style={[styles.boxText, selectedCategory === cat.name && styles.boxTextActive]} numberOfLines={1}>
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  box: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    gap: 4,
  },
  boxActive: { backgroundColor: '#111' },
  boxText: { fontSize: 10, fontWeight: '600', color: '#555', textAlign: 'center' },
  boxTextActive: { color: '#fff' },
})