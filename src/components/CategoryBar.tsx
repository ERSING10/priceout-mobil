import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const CATEGORIES: { name: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { name: 'Tümü', icon: 'grid-outline' },
  { name: 'Giyim', icon: 'shirt-outline' },
  { name: 'Ayakkabı', icon: 'footsteps-outline' },
  { name: 'Aksesuar', icon: 'briefcase-outline' },
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
      {CATEGORIES.map((cat) => {
        const isSelected = cat.name === 'Tümü' ? selectedCategory === '' : selectedCategory === cat.name
        return (
          <TouchableOpacity
            key={cat.name}
            style={styles.item}
            onPress={() => onSelect(cat.name === 'Tümü' ? '' : cat.name)}
            activeOpacity={0.7}
          >
            <TouchableOpacity
              style={[styles.circle, isSelected && styles.circleActive]}
              onPress={() => onSelect(cat.name === 'Tümü' ? '' : cat.name)}
            >
              <Ionicons name={cat.icon} size={22} color={isSelected ? '#fff' : '#444'} />
            </TouchableOpacity>
            <Text style={[styles.label, isSelected && styles.labelActive]}>{cat.name}</Text>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 12, gap: 18 },
  item: { alignItems: 'center' },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  circleActive: { backgroundColor: '#16a34a' },
  label: { fontSize: 11, fontWeight: '600', color: '#555' },
  labelActive: { color: '#16a34a', fontWeight: '700' },
})