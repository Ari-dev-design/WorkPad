import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface InvoiceCardProps {
  invoice: {
    id: number;
    number: string;
    amount: string | number;
    status: string;
    date?: string;
  };
  onPress: () => void;
}

export default function InvoiceCard({ invoice, onPress }: InvoiceCardProps) {
  const isPaid = invoice.status === "Paid";

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.leftCol}>
        <Text style={styles.number}>{invoice.number}</Text>
        <Text style={styles.date}>{invoice.date}</Text>
      </View>

      <View style={styles.rightCol}>
        <Text style={styles.amount}>{invoice.amount} €</Text>
        <Text
          style={[styles.status, isPaid ? styles.textGreen : styles.textOrange]}
        >
          {invoice.status}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={16}
        color="#D1D5DB"
        style={{ marginLeft: 8 }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  leftCol: { flex: 1 },
  number: { fontSize: 15, fontWeight: "bold", color: "#374151" },
  date: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  rightCol: { alignItems: "flex-end" },
  amount: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  status: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  textGreen: { color: "#059669" },
  textOrange: { color: "#D97706" },
});
