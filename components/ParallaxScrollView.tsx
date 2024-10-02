import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, useColorScheme, Dimensions } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  onScroll: any
}>;
const { height: screenHeight } = Dimensions.get('window');
export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  onScroll,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}
        onScroll={(event) => {
          const currentOffset: number = event.nativeEvent.contentOffset.y;
          scrollOffset.value = currentOffset;
          if (onScroll) onScroll(currentOffset); // Chiamata alla callback
        }}>
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}>
          {headerImage}
        </Animated.View>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#132A68"//#132A68
  },
  header: {
    height: (screenHeight * 4) / 9, // Calcola l'altezza come 4/6 dello schermo
    overflow: 'hidden',
    borderBottomLeftRadius: 30,  // Arrotonda l'angolo inferiore sinistro
    borderBottomRightRadius: 30, // Arrotonda l'angolo inferiore destro
  },
  content: {
    flex: 1,
    padding: 2,
    paddingHorizontal: 10,
    gap: 16,
    backgroundColor: "transparent",
    overflow: 'hidden',
  },
});
