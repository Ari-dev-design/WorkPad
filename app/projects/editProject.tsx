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

// COMPONENTES Y API
import Button from "../../components/Button";
import Input from "../../components/Input";
import {
  getProjectById,
  markInvoicesAsPaid,
  updateProject,
} from "../../services/api";

export default function EditProject() {
  const router = useRouter();
  const { projectId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    deadline: "",
    status: "",
  });

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    const data = await getProjectById(projectId);
    if (data) {
      setForm({
        title: data.title,
        description: data.description || "",
        price: data.price ? data.price.toString() : "",
        deadline: data.deadline || "",
        status: data.status,
      });
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    setSaving(true);

    // 1. Actualizamos el proyecto
    const projectSuccess = await updateProject(projectId, form);

    // 2. Automatización de facturas
    if (projectSuccess && form.status === "Completed") {
      await markInvoicesAsPaid(projectId);
    }

    setSaving(false);
    if (projectSuccess) {
      Alert.alert("Éxito", "Proyecto actualizado", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      Alert.alert("Error", "No se pudo actualizar");
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
      <Text style={styles.headerTitle}>Editing Project ID: {projectId}</Text>

      <Input
        label="Title"
        value={form.title}
        onChangeText={(t) => setForm({ ...form, title: t })}
      />

      <Text style={styles.label}>Status</Text>
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

      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Input
            label="Price"
            value={form.price}
            onChangeText={(t) => setForm({ ...form, price: t })}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Input
            label="Deadline"
            value={form.deadline}
            onChangeText={(t) => setForm({ ...form, deadline: t })}
          />
        </View>
      </View>

      <Input
        label="Description"
        value={form.description}
        onChangeText={(t) => setForm({ ...form, description: t })}
        multiline
        numberOfLines={4}
        style={{ height: 100, textAlignVertical: "top" }}
      />

      <Button title="Save Changes" onPress={handleUpdate} loading={saving} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 20,
  },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  statusContainer: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 20,
    flexWrap: "wrap",
  },
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
  statusText: { fontSize: 12, color: "#4B5563" },
  textActive: { color: "#7C3AED", fontWeight: "bold" },
});
