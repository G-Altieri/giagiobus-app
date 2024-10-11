import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { View } from 'react-native';  // Puoi rimuovere se non ti serve
import { useColorScheme } from '@/hooks/useColorScheme';

import { NotificationProvider } from "@/context/NotificationContext";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, error, executionInfo }) => {
    console.log("✅ Received a notification in the background!", {
      data,
      error,
      executionInfo,
    });
  }
);

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Nunito: require('../assets/fonts/Nunito-Regular.ttf'),
    NunitoRegular: require('../assets/fonts/Nunito-Regular.ttf'),
    NunitoSemiBold: require('../assets/fonts/Nunito-SemiBold.ttf'),
    NunitoBold: require('../assets/fonts/Nunito-Bold.ttf'),
    NunitoMedium: require('../assets/fonts/Nunito-Medium.ttf'),
    NunitoLight: require('../assets/fonts/Nunito-Light.ttf'),
    NunitoExtraBold: require('../assets/fonts/Nunito-ExtraBold.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <NotificationProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* Schermata principale delle tabs */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Schermata not-found */}
          <Stack.Screen name="+not-found" />
        </Stack>

      </ThemeProvider>
    </NotificationProvider>
  );
}
