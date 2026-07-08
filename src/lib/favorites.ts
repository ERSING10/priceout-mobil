import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = 'cart_product_ids' // AsyncStorage'da bu isimle saklanacak

// Kayıtlı ürün id'lerini getirir
export async function getCartIds(): Promise<string[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY)
  return json ? JSON.parse(json) : [] // veri yoksa boş dizi dön
}

// Sepete ürün ekler
export async function addToCart(productId: string) {
  const ids = await getCartIds()
  if (ids.includes(productId)) return // zaten ekliyse tekrar ekleme
  const updated = [...ids, productId]
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

// Sepetten ürün çıkarır
export async function removeFromCart(productId: string) {
  const ids = await getCartIds()
  const updated = ids.filter(id => id !== productId)
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}