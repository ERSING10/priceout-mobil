import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import BrandsListScreen from '../screens/BrandsListScreen'
import BrandProductsScreen from '../screens/BrandProductsScreen'
import CartScreen from '../screens/CartScreen'
import ProductDetailScreen from '../screens/ProductDetailScreen'
import ProductWebViewScreen from '../screens/ProductWebViewScreen'

const Tab = createBottomTabNavigator()
const HomeStack = createNativeStackNavigator()
const BrandsStack = createNativeStackNavigator()
const CartStack = createNativeStackNavigator()

// Her stack'te ortak olan iki ekran: Detay ve WebView
// Bunu tekrar yazmamak için küçük bir fonksiyon yapıyoruz
function addSharedScreens(Stack: any) {
  return (
    <>
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="ProductWebView" component={ProductWebViewScreen} options={{ title: '' }} />
    </>
  )
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Anasayfa' }} />
      {addSharedScreens(HomeStack)}
    </HomeStack.Navigator>
  )
}

function BrandsStackNavigator() {
  return (
    <BrandsStack.Navigator>
      <BrandsStack.Screen name="BrandsList" component={BrandsListScreen} options={{ title: 'Markalar' }} />
      <BrandsStack.Screen name="BrandProducts" component={BrandProductsScreen} options={{ title: '' }} />
      {addSharedScreens(BrandsStack)}
    </BrandsStack.Navigator>
  )
}

function CartStackNavigator() {
  return (
    <CartStack.Navigator>
      <CartStack.Screen name="CartMain" component={CartScreen} options={{ title: 'Sepetim' }} />
      {addSharedScreens(CartStack)}
    </CartStack.Navigator>
  )
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStackNavigator} options={{ headerShown: false, title: 'Anasayfa' }} />
        <Tab.Screen name="Brands" component={BrandsStackNavigator} options={{ headerShown: false, title: 'Markalar' }} />
        <Tab.Screen name="Cart" component={CartStackNavigator} options={{ headerShown: false, title: 'Sepetim' }} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}