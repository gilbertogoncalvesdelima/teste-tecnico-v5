// apps/mobile/src/components/PropertyListItem.tsx

import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import type { PropertySummary } from "@repo/shared/domain/Property";
import { normalizePriceToCents } from "@repo/shared/domain/PriceEngine";

interface PropertyListItemProps {
  property: PropertySummary;
  isFavorited: boolean;
  onPress: (slug: string) => void;
  onFavorite: (id: string) => void;
}

export const PropertyListItem = React.memo(function PropertyListItem({
  property,
  isFavorited,
  onPress,
  onFavorite,
}: PropertyListItemProps) {
  const photo = property.photos[0] ?? "https://placeholder.example.com/no-image.jpg";

  const handlePress = useCallback(() => {
    onPress(property.slug);
  }, [onPress, property.slug]);

  const handleFavorite = useCallback(() => {
    onFavorite(property.id);
  }, [onFavorite, property.id]);

  const priceInCents = normalizePriceToCents(property);
  const priceDisplay = (priceInCents / 100).toLocaleString("pt-BR");

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, { borderColor: isFavorited ? "#E94560" : "#e2e8f0" }]}
    >
      <Image
        source={{ uri: photo }}
        style={styles.photo}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.neighborhood}>
          {property.neighborhood}
        </Text>
        <Text style={styles.price}>
          R$ {priceDisplay}
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleFavorite}
        style={styles.favoriteBtn}
      >
        <Text style={styles.favoriteIcon}>{isFavorited ? "♥" : "♡"}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  neighborhood: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  favoriteBtn: {
    padding: 12,
  },
  favoriteIcon: {
    fontSize: 24,
  },
});
