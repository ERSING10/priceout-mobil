import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = 'cart_product_ids' 

export async function getCartIds(): Promise<string[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY)
  return json ? JSON.parse(json) : [] 
}


export async function addToCart(productId: string) {
  const ids = await getCartIds()
  if (ids.includes(productId)) return
  const updated = [...ids, productId]
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export async function removeFromCart(productId: string) {
  const ids = await getCartIds()
  const updated = ids.filter(id => id !== productId)
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}