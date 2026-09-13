import { useEffect } from 'react'
import AppNavigator from './src/navigation/AppNavigator'
import { registerForPushNotificationsAsync } from './src/lib/notifications'

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      console.log('PUSH TOKEN:', token)
    })
  }, [])

  return <AppNavigator />
}