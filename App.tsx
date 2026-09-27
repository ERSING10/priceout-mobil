import { useEffect } from 'react'
import AppNavigator from './src/navigation/AppNavigator'
import { registerForPushNotificationsAsync, savePushToken } from './src/lib/notifications'

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      console.log('PUSH TOKEN:', token)
      if (token) {
        savePushToken(token)
      }
    })
  }, [])
  
  return <AppNavigator />
}