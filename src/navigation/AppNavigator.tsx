import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { View, TouchableOpacity } from 'react-native'
import HomeScreen from '../screens/HomeScreen'
import DiscoverScreen from '../screens/DiscoverScreen'
import BrandsListScreen from '../screens/BrandsListScreen'
import BrandProductsScreen from '../screens/BrandProductsScreen'
import CartScreen from '../screens/CartScreen'
import ProductDetailScreen from '../screens/ProductDetailScreen'
import ProductWebViewScreen from '../screens/ProductWebViewScreen'
import SearchScreen from '../screens/SearchScreen'
import AccountScreen from '../screens/AccountScreen'
import { Ionicons } from '@expo/vector-icons'
import SignUpScreen from '../screens/SignUpScreen'
import LoginScreen from '../screens/LoginScreen'
import ChangePasswordScreen from '../screens/ChangePasswordScreen'
import PersonalInfoScreen from '../screens/PersonalInfoScreen'
import ChangeEmailScreen from '../screens/ChangeEmailScreen'
import ContactSupportScreen from '../screens/ContactSupportScreen'

const Tab = createBottomTabNavigator()
const HomeStack = createNativeStackNavigator()
const DiscoverStack = createNativeStackNavigator()
const BrandsStack = createNativeStackNavigator()
const CartStack = createNativeStackNavigator()

function addSharedScreens(Stack: any) {
  return (
    <>
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProductWebView" component={ProductWebViewScreen} options={{ title: '' }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Ürün Ara' }} />
      <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChangeEmail" component={ChangeEmailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ContactSupport" component={ContactSupportScreen} options={{ headerShown: false }} />
    </>
  )
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerTitleStyle: { fontSize: 22, fontWeight: '800', color: '#1a1625' },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#fff' },
      }}
    >
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      {addSharedScreens(HomeStack)}
    </HomeStack.Navigator>
  )
}

function DiscoverStackNavigator() {
  return (
    <DiscoverStack.Navigator>
      <DiscoverStack.Screen name="DiscoverMain" component={DiscoverScreen} options={{ headerShown: false }} />
      {addSharedScreens(DiscoverStack)}
    </DiscoverStack.Navigator>
  )
}

function BrandsStackNavigator() {
  return (
    <BrandsStack.Navigator
      screenOptions={{
        headerTitleStyle: { fontSize: 22, fontWeight: '800', color: '#1a1625' },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#fff' },
      }}
    >
      <BrandsStack.Screen name="BrandsList" component={BrandsListScreen} options={{ headerShown: false }} />
      <BrandsStack.Screen name="BrandProducts" component={BrandProductsScreen} options={{ title: '' }} />
      {addSharedScreens(BrandsStack)}
    </BrandsStack.Navigator>
  )
}

function CartStackNavigator() {
  return (
    <CartStack.Navigator
      screenOptions={{
        headerTitleStyle: { fontSize: 22, fontWeight: '800', color: '#1a1625' },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#fff' },
      }}
    >
      <CartStack.Screen name="CartMain" component={CartScreen} options={{ headerShown: false }} />
      {addSharedScreens(CartStack)}
    </CartStack.Navigator>
  )
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{
            headerShown: false,
            title: 'Yeni',
            tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Discover"
          component={DiscoverStackNavigator}
          options={{
            headerShown: false,
            title: 'Keşfet',
            tabBarIcon: ({ color, size }) => <Ionicons name="compass-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Brands"
          component={BrandsStackNavigator}
          options={{
            headerShown: false,
            title: 'Mağazalar',
            tabBarIcon: ({ color, size }) => <Ionicons name="pricetags-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartStackNavigator}
          options={{
            headerShown: false,
            title: 'Favorilerim',
            tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" size={size} color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}