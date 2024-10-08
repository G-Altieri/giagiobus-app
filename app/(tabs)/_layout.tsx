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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Linee',
          href: '/',
          tabBarIcon: ({ color, focused }) =>
            focused ? <IconaLineeFill size={26} /> : <IconaLineeOutline size={26} />,
        }}
      />
      <Tabs.Screen
        name="fermate"
        options={{
          title: 'Fermate',
          href: '/fermate',
          tabBarIcon: ({ color, focused }) =>
            !focused ? <IconaBusStopOutline size={26} /> : <IconaBusStopFill size={26} />,
        }}
      />
      <Tabs.Screen
        name="dettagliLinea"
        options={{
          //  href: '/dettagliLinea',
          tabBarButton: () => null
        }} // Nascondi l'icona nella tab bar
      />
      <Tabs.Screen
        name="dettagliFermata"
        options={{
          //  href: '/dettagliFermata',
          tabBarButton: () => null
        }} // Nascondi l'icona nella tab bar
      />
    </Tabs>
  );
}
