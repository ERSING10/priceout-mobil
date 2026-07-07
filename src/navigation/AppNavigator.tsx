import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/HomeScreen'
import BrandsScreen from '../screens/BrandsScreen'
import CartScreen from '../screens/CartScreen'

const Tab = createBottomTabNavigator()

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Anasayfa" component={HomeScreen} />
        <Tab.Screen name="Markalar" component={BrandsScreen} />
        <Tab.Screen name="Sepet" component={CartScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}