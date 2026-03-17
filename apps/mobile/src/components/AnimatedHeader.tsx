// apps/mobile/src/components/AnimatedHeader.tsx

import { Text, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";

interface AnimatedHeaderProps {
  title: string;
  scrollY: SharedValue<number>;
  /** Altura em que o header fica totalmente compacto */
  collapseThreshold?: number;
}

export function AnimatedHeader({
  title,
  scrollY,
  collapseThreshold = 150,
}: AnimatedHeaderProps) {
  const headerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, collapseThreshold],
      [200, 60],
      Extrapolation.CLAMP
    ),
  }));

  const expandedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, collapseThreshold * 0.6],
      [1, 0],
      Extrapolation.CLAMP
    ),
  }));

  const compactStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [collapseThreshold * 0.6, collapseThreshold],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <Animated.View style={[styles.header, headerStyle]}>
      {/* Título expandido */}
      <Animated.View style={[styles.expandedTitle, expandedStyle]}>
        <Text style={styles.titleLarge}>{title}</Text>
      </Animated.View>

      {/* Título compacto */}
      <Animated.View style={[styles.compactTitle, compactStyle]}>
        <Text style={styles.titleSmall}>{title}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 10,
    justifyContent: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  expandedTitle: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  compactTitle: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  titleLarge: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
  },
  titleSmall: {
    fontSize: 17,
    fontWeight: "600",
    color: "#0f172a",
  },
});
