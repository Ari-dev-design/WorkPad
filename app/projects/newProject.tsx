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

// COMPONENTES REUTILIZABLES
import Button from "../../components/Button";
import Input from "../../components/Input";
import { insertProject } from "../../services/api";

export default function NewProject() {
  const router = useRouter();
  const { clientId } = useLocalSearchParams();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    deadline: "",
    status: "Pending",
    client_id: clientId,
  });

  const handleSave = async () => {
    if (!form.title) {
      Alert.alert("Error", "Please enter a project title");
      return;
    }

    setSaving(true);
    const success = await insertProject(form);
    setSaving(false);

    if (success) {
      Alert.alert("Success", "Project created successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      Alert.alert("Error", "Could not save project");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Cabecera Informativa */}
      <View style={styles.headerNote}>
        <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
        <Text style={styles.headerNoteText}>
          Linked to Client ID:{" "}
          <Text style={{ fontWeight: "bold" }}>{clientId}</Text>
        </Text>
      </View>

      <Input
        label="Project Title *"
        value={form.title}
        onChangeText={(t) => setForm({ ...form, title: t })}
        placeholder=""
      />

      <Input
        label="Description"
        value={form.description}
        onChangeText={(t) => setForm({ ...form, description: t })}
        placeholder=""
        multiline
        numberOfLines={4}
        style={{ height: 100, textAlignVertical: "top" }}
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Input
            label="Budget (€)"
            value={form.price}
            onChangeText={(t) => setForm({ ...form, price: t })}
            placeholder=""
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Input
            label="Deadline"
            value={form.deadline}
            onChangeText={(t) => setForm({ ...form, deadline: t })}
            placeholder="DD/MM/YYYY"
          />
        </View>
      </View>

      <Text style={styles.label}>Initial Status</Text>
      <View style={styles.statusContainer}>
        {["Pending", "In Progress", "Completed"].map((status) => (
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

      <Button title="Create Project" onPress={handleSave} loading={saving} />
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
  row: { flexDirection: "row" },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },

  // Estilos específicos para los botones de estado (chips)
  statusContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 30,
    flexWrap: "wrap",
  },
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
