import { View, useWindowDimensions } from 'react-native'
import SkeletonCard from './SkeletonCard'

export default function SkeletonGrid() {
  const { width } = useWindowDimensions()
  const cardWidth = (width - 24) / 2

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 8 }}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <SkeletonCard key={i} cardWidth={cardWidth} />
      ))}
    </View>
  )
}