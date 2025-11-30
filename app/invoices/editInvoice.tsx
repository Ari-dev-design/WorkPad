import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getInvoiceById, updateInvoice } from "../../services/api";

// IMPORTAMOS LOS NUEVOS COMPONENTES
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function EditInvoice() {
  const router = useRouter();
  const { invoiceId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    number: "",
    amount: "",
    date: "",
    status: "",
  });

  useEffect(() => {
    loadData();
  }, [invoiceId]);

  const loadData = async () => {
    const data = await getInvoiceById(invoiceId);
    if (data) {
      setForm({
        number: data.number,
        amount: data.amount ? data.amount.toString() : "",
        date: data.date,
        status: data.status,
      });
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!form.amount || isNaN(Number(form.amount)))
      return Alert.alert("Error", "Importe inválido.");

    setSaving(true);
    const success = await updateInvoice(invoiceId, form);
    setSaving(false);

    if (success) {
      Alert.alert("Éxito", "Factura actualizada", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  };

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#7C3AED"
        style={{ marginTop: 50 }}
      />
    );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Editing Invoice: {form.number}</Text>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Input
            label="Amount (€)"
            value={form.amount}
            onChangeText={(t) =>
              setForm({ ...form, amount: t.replace(/[^0-9.]/g, "") })
            }
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Input
            label="Date"
            value={form.date}
            onChangeText={(t) => setForm({ ...form, date: t })}
          />
        </View>
      </View>

      <Text style={styles.label}>Status</Text>
      <View style={styles.statusContainer}>
        {["Pending", "Paid", "Cancelled"].map((status) => (
          <Pressable
            key={status}
            style={[
              styles.statusButton,
              form.status === status && styles.statusButtonActive,
            ]}
            onPress={() => setForm({ ...form, status: status })}
          >
            <Text
              style={[
                styles.statusText,
                form.status === status && styles.textActive,
              ]}
            >
              {status}
            </Text>
          </Pressable>
        ))}
      </View>

      <Button title="Save Changes" onPress={handleUpdate} loading={saving} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#374151",
  },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8, color: "#374151" },
  statusContainer: { flexDirection: "row", gap: 10, marginBottom: 20 },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  statusButtonActive: {
    backgroundColor: "#EDE9FE",
    borderColor: "#7C3AED",
    borderWidth: 1,
  },
  statusText: { fontSize: 13, color: "#4B5563", fontWeight: "600" },
  textActive: { color: "#7C3AED" },
});
