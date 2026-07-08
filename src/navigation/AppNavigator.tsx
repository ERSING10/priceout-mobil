import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import BrandsListScreen from '../screens/BrandsListScreen'
import BrandProductsScreen from '../screens/BrandProductsScreen'
import CartScreen from '../screens/CartScreen'

const Tab = createBottomTabNavigator()
const BrandsStack = createNativeStackNavigator() // Markalar sekmesinin kendi iç geçmişi

// Markalar sekmesinin içindeki stack: liste -> ürünler
function BrandsStackNavigator() {
  return (
    <BrandsStack.Navigator>
      <BrandsStack.Screen name="BrandsList" component={BrandsListScreen} options={{ title: 'Markalar' }} />
      <BrandsStack.Screen name="BrandProducts" component={BrandProductsScreen} options={{ title: '' }} />
    </BrandsStack.Navigator>
  )
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Brands" component={BrandsStackNavigator} options={{ headerShown: false }} />
        <Tab.Screen name="Cart" component={CartScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}