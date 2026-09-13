import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('Push bildirimleri sadece fiziksel cihazda çalışır, emülatörde token alınamaz')
    return null
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    console.log('Kullanıcı bildirim iznini reddetti')
    return null
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    })
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId
  if (!projectId) {
    console.log('EAS projectId bulunamadı, app.json kontrol et')
    return null
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId })
  return tokenData.data
}