// apps/mobile/src/components/FavoriteButton.tsx
// ⛔ NÃO ALTERE ESTE ARQUIVO
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface FavoriteButtonProps {
  isFavorited: boolean;
  onPress: () => void;
}

export function FavoriteButton({ isFavorited, onPress }: FavoriteButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={[styles.icon, isFavorited && styles.active]}>
        {isFavorited ? "♥" : "♡"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { padding: 12 },
  icon: { fontSize: 24, color: "#94a3b8" },
  active: { color: "#E94560" },
});
