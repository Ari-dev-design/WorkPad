import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function Button({
  title,
  onPress,
  loading,
  variant = "primary",
  icon,
  style,
  disabled,
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return "#E5E7EB";
    if (variant === "danger") return "#FEE2E2";
    if (variant === "secondary") return "#EFF6FF";
    return "#7C3AED"; // Primary (Morado)
  };

  const getTextColor = () => {
    if (disabled) return "#9CA3AF";
    if (variant === "danger") return "#DC2626";
    if (variant === "secondary") return "#3B82F6";
    return "white";
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      style={[styles.button, { backgroundColor: getBackgroundColor() }, style]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "white" : "#374151"}
        />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={getTextColor()}
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // Sombra suave
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
