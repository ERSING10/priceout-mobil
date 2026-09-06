import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

export default function TopBar() {
  const navigation = useNavigation<any>()

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.icons}>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#1a1625" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <Ionicons name="person-circle-outline" size={26} color="#1a1625" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },
  logo: { width: 120, height: 40 }, // logonun oranı ~2.2:1, genişliği artırırsan height'ı da orantılı büyüt
  icons: { flexDirection: 'row', gap: 16 },
})