import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { insertInvoice } from "../../services/api";

// IMPORTAMOS LOS NUEVOS COMPONENTES
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function NewInvoice() {
  const router = useRouter();
  const { projectId } = useLocalSearchParams();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    number: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    amount: "",
    date: new Date().toISOString().split("T")[0],
    status: "Pending",
    project_id: projectId,
  });

  const validateForm = () => {
    if (!form.amount) {
      Alert.alert("Error", "Debes poner un importe (€).");
      return false;
    }
    if (isNaN(Number(form.amount))) {
      Alert.alert(
        "Error",
        "El importe debe ser un número (usa punto para decimales)."
      );
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    const success = await insertInvoice(form);
    setSaving(false);

    if (success) {
      Alert.alert("Éxito", "Factura generada", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      Alert.alert("Error", "No se pudo guardar la factura");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerNote}>
        <Ionicons name="receipt-outline" size={20} color="#6B7280" />
        <Text style={styles.headerNoteText}>
          Facturando al Proyecto ID:{" "}
          <Text style={{ fontWeight: "bold" }}>{projectId}</Text>
        </Text>
      </View>

      <Input
        label="Invoice Number"
        value={form.number}
        editable={false}
        style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}
      />

      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Input
            label="Amount (€) *"
            placeholder="0.00"
            keyboardType="numeric"
            value={form.amount}
            onChangeText={(t) =>
              setForm({ ...form, amount: t.replace(/[^0-9.]/g, "") })
            }
          />
        </View>
        <View style={{ flex: 1 }}>
          <Input
            label="Date"
            value={form.date}
            onChangeText={(t) => setForm({ ...form, date: t })}
            placeholder="YYYY-MM-DD"
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

      <Button title="Generate Invoice" onPress={handleSave} loading={saving} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#E5E7EB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  headerNoteText: { color: "#6B7280", fontSize: 13 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  statusContainer: { flexDirection: "row", gap: 10, marginBottom: 20 },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  statusButtonActive: { backgroundColor: "#EDE9FE", borderColor: "#7C3AED" },
  statusText: { fontSize: 13, color: "#4B5563" },
  textActive: { color: "#7C3AED", fontWeight: "600" },
});
