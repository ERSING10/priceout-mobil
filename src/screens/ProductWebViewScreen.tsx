import { View, Text, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'
import { useRoute } from '@react-navigation/native'

export default function ProductWebViewScreen() {
  const route = useRoute<any>()
  const { url } = route.params as { url: string }

  return (
    <View style={styles.container}>
      <View style={styles.urlBar}>
        <Text style={styles.urlText} numberOfLines={1}>🔒 {url}</Text>
      </View>
      <WebView source={{ uri: url }} style={styles.webview} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  urlBar: { backgroundColor: '#f0f0f0', paddingVertical: 8, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  urlText: { fontSize: 12, color: '#555' },
  webview: { flex: 1 },
})