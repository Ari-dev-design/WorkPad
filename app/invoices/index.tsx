import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getAllInvoices } from "../../services/api"; // <--- Función nueva

export default function InvoicesList() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    setLoading(true);
    const data = await getAllInvoices();
    setInvoices(data);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Invoices</Text>

      {loading ? (
        <ActivityIndicator color="#F59E0B" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item: any) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.empty}>No invoices generated.</Text>
          }
          contentContainerStyle={{ gap: 15, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Pressable
              style={styles.ticket}
              onPress={() => router.push(`/invoices/${item.id}`)}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="receipt" size={20} color="#F59E0B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.number}>{item.number}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.amount}>{item.amount} €</Text>
                <Text
                  style={[
                    styles.status,
                    item.status === "Paid"
                      ? { color: "green" }
                      : { color: "orange" },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F3F4F6" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111827",
  },
  empty: { textAlign: "center", color: "#6B7280", marginTop: 50 },
  ticket: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
  },
  number: { fontSize: 16, fontWeight: "bold", color: "#374151" },
  date: { fontSize: 12, color: "#9CA3AF" },
  amount: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  status: { fontSize: 12, fontWeight: "bold" },
});
