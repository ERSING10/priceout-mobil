import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import TopBar from './TopBar'

type Props = {
  title: string
  onBackPress?: () => void
}

export default function ScreenHeader({ title, onBackPress }: Props) {
  const navigation = useNavigation<any>()

  return (
    <View>
      <TopBar />
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={onBackPress ?? (() => navigation.goBack())} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color="#1a1625" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, marginTop: 4, marginBottom: 10 },
  title: { fontSize: 20, fontWeight: '800', color: '#1a1625' },
})