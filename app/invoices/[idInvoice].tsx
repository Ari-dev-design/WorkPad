import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { deleteInvoice, getInvoiceById } from "../../services/api";

export default function InvoiceDetail() {
  const { idInvoice } = useLocalSearchParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [idInvoice])
  );

  const loadData = async () => {
    setLoading(true);
    const data = await getInvoiceById(idInvoice);
    setInvoice(data);
    setLoading(false);
  };

  const handleDelete = () => {
    Alert.alert("Borrar Factura", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const success = await deleteInvoice(idInvoice);
          if (success) router.back(); // Volver al proyecto
        },
      },
    ]);
  };

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#7C3AED"
        style={{ marginTop: 50 }}
      />
    );
  if (!invoice) return <Text style={{ padding: 20 }}>Invoice not found</Text>;

  return (
    <ScrollView style={styles.container}>
      {/* TICKET DE FACTURA */}
      <View style={styles.ticket}>
        <View style={styles.iconCircle}>
          <Ionicons name="receipt" size={32} color="#7C3AED" />
        </View>

        <Text style={styles.amount}>{invoice.amount} €</Text>
        <Text style={styles.number}>{invoice.number}</Text>

        <View
          style={[
            styles.badge,
            invoice.status === "Paid" ? styles.bgGreen : styles.bgOrange,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              invoice.status === "Paid" ? styles.textGreen : styles.textOrange,
            ]}
          >
            {invoice.status}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Date Issued</Text>
          <Text style={styles.value}>{invoice.date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Invoice ID (BD)</Text>
          <Text style={styles.value}>{idInvoice}</Text>
        </View>
      </View>

      {/* BOTONES DE ACCIÓN */}
      <Pressable
        style={styles.actionButton}
        onPress={() => Alert.alert("PDF", "Descarga simulada.")}
      >
        <Ionicons name="download-outline" size={20} color="#4B5563" />
        <Text style={styles.actionText}>Download PDF</Text>
      </Pressable>

      <Pressable
        style={[styles.actionButton, styles.deleteButton]}
        onPress={handleDelete}
      >
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
        <Text style={[styles.actionText, { color: "#EF4444" }]}>
          Delete Invoice
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  ticket: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  number: { fontSize: 16, color: "#6B7280", marginBottom: 16 },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 24,
  },
  badgeText: { fontWeight: "bold", fontSize: 14 },
  bgGreen: { backgroundColor: "#DCFCE7" },
  textGreen: { color: "#166534" },
  bgOrange: { backgroundColor: "#FFEDD5" },
  textOrange: { color: "#9A3412" },

  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  label: { color: "#6B7280", fontSize: 14 },
  value: { color: "#111827", fontSize: 14, fontWeight: "500" },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },
  deleteButton: { borderColor: "#FEE2E2", backgroundColor: "#FEF2F2" },
  actionText: { fontSize: 16, fontWeight: "500", color: "#374151" },
});
