// apps/mobile/src/screens/PropertyListScreen.tsx
// MÓDULO 4: Este screen usa os componentes bugados. Não precisa alterar este arquivo diretamente
// — corrija PropertyListItem.tsx, propertyStore.ts, e AnimatedHeader.tsx.

import { useCallback, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import Animated, { useSharedValue, useAnimatedScrollHandler } from "react-native-reanimated";
import { usePropertyStore, selectPropertyList, selectFavoriteIds } from "../stores/propertyStore";
import { PropertyListItem } from "../components/PropertyListItem";
import { AnimatedHeader } from "../components/AnimatedHeader";
import type { PropertySummary } from "@repo/shared/domain/Property";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<PropertySummary>);

export function PropertyListScreen() {
  const properties = usePropertyStore(selectPropertyList);
  const favorites = usePropertyStore(selectFavoriteIds);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handlePress = useCallback((slug: string) => {
    // navigation.navigate("PropertyDetail", { slug });
    console.log("Navigate to", slug);
  }, []);

  const handleFavorite = useCallback((id: string) => {
    usePropertyStore.getState().toggleFavorite(id);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: PropertySummary }) => (
      <PropertyListItem
        property={item}
        isFavorited={favorites.has(item.id)}
        onPress={handlePress}
        onFavorite={handleFavorite}
      />
    ),
    [favorites, handlePress, handleFavorite]
  );

  return (
    <View style={styles.container}>
      <AnimatedHeader title="Imóveis" scrollY={scrollY} />
      <AnimatedFlashList
        data={properties}
        renderItem={renderItem}
        estimatedItemSize={130}
        onScroll={scrollHandler}
        contentContainerStyle={{ paddingTop: 200 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
});
