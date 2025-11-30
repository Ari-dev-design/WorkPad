import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

// Función auxiliar para formatear: +34 600 123 456
const formatPhone = (phone: string | null) => {
  if (!phone) return "No phone";
  // Detecta: (+Prefijo) (3 num) (3 num) (3 num)
  return phone.replace(/(\+\d{1,3})(\d{3})(\d{3})(\d{3})/, "$1 $2 $3 $4");
};

interface ClientCardProps {
  client: {
    id: number;
    nombre: string;
    email: string | null;
    telefono: string | null;
    logo_url: string | null;
  };
  onPress: () => void;
}

export default function ClientCard({ client, onPress }: ClientCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {/* FOTO */}
      {client.logo_url ? (
        <Image source={{ uri: client.logo_url }} style={styles.clientImage} />
      ) : (
        <View style={styles.iconBox}>
          <Ionicons name="business" size={24} color="#7C3AED" />
        </View>
      )}

      {/* TEXTOS */}
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{client.nombre}</Text>

        {/* Teléfono Formateado */}
        <Text style={styles.cardSubtitle}>{formatPhone(client.telefono)}</Text>

        <Text style={styles.cardEmail}>{client.email || "No email"}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#b6b7b9ff" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffffff",
    padding: 16,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 6,
  },
  clientImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  iconBox: {
    width: 50,
    height: 50,
    backgroundColor: "#EDE9FE",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  cardSubtitle: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
    marginBottom: 2,
  },
  cardEmail: { fontSize: 12, color: "#9CA3AF" },
});
