import { Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconaBusStopFill, IconaBusStopOutline, IconaLineeFill, IconaLineeOutline } from '@/components/utils/Icone';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
      }}
    >
      {/* Home, schermata principale */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Linee',
          href: '/',
          tabBarIcon: ({ color, focused }) =>
            focused ? <IconaLineeFill size={26} /> : <IconaLineeOutline size={26} />,
        }}
      />
      {/* Fermate, schermata con tutte le fermate sulla mappa */}
      <Tabs.Screen
        name="fermate"
        options={{
          title: 'Fermate',
          href: '/fermate',
          tabBarIcon: ({ color, focused }) =>
            !focused ? <IconaBusStopOutline size={26} /> : <IconaBusStopFill size={26} />,
        }}
      />
      {/* Dettagli di una singola linea di Bus*/}
      <Tabs.Screen
        name="dettagliLinea"
        options={{
          tabBarButton: () => null
        }} // Nascondi l'icona nella tab bar
      />
      {/* Dettagli di una singola Fermata*/}
      <Tabs.Screen
        name="dettagliFermata"
        options={{
          tabBarButton: () => null
        }} // Nascondi l'icona nella tab bar
      />
    </Tabs>
  );
}
