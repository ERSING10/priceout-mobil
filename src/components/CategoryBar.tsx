import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const CATEGORIES: { name: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { name: 'Giyim', icon: 'shirt-outline' },
  { name: 'Ayakkabı', icon: 'footsteps-outline' },
  { name: 'Aksesuar', icon: 'glasses-outline' },
  { name: 'Outlet', icon: 'flash-outline' },
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
  boxActive: { backgroundColor: '#1a1625' },
  boxText: { fontSize: 10, fontWeight: '600', color: '#555', textAlign: 'center' },
  boxTextActive: { color: '#fff' },
})