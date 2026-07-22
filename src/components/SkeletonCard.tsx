import { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet } from 'react-native'

type Props = {
  cardWidth: number
}

export default function SkeletonCard({ cardWidth }: Props) {
  const opacity = useRef(new Animated.Value(0.3)).current // animasyonun başlangıç değeri

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ])
    )
    pulse.start()
    return () => pulse.stop() // ekran kapanınca animasyonu durdur
  }, [])

  return (
    <View style={{ width: cardWidth, marginBottom: 16 }}>
      <Animated.View style={[styles.image, { width: cardWidth, height: cardWidth * 1.1, opacity }]} />
      <Animated.View style={[styles.line, { width: cardWidth * 0.8, opacity }]} />
      <Animated.View style={[styles.line, { width: cardWidth * 0.5, opacity }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  image: { backgroundColor: '#e0e0e0', borderRadius: 10 },
  line: { backgroundColor: '#e0e0e0', height: 10, borderRadius: 4, marginTop: 8 },
})