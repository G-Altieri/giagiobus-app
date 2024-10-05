import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconaBusStopFill, IconaBusStopOutline, IconaLineeFill, IconaLineeOutline } from '@/components/utils/Icone';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (<>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          //borderTopColor: Colors[colorScheme ?? 'light'].border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Linee',
          tabBarIcon: ({ color, focused }) => (<>
            {focused ? <IconaLineeFill size={26} /> : <IconaLineeOutline size={26} />}
            {/* <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} /> */}
          </>
          ),
        }}
      />
      <Tabs.Screen
        name="fermate"
        options={{
          title: 'Fermate',
          tabBarIcon: ({ color, focused }) => (<>
            {!focused ? <IconaBusStopOutline size={26} /> : <IconaBusStopFill size={26} />}
          </>),
        }}
      />
      <Tabs.Screen
        name="homeFarlocca"
        options={{
          title: 'homeFarlocca',
          tabBarButton: () => null,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          title: 'Test',
          tabBarButton: () => null,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dettagliLinea"
        options={{
          title: 'dettagliLinea',
          tabBarButton: () => null,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  </>);
}
