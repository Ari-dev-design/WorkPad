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

// Importamos la API
import {
  deleteProject,
  getInvoicesByProject,
  getProjectById,
} from "../../services/api";

export default function ProjectDetail() {
  const { idProject } = useLocalSearchParams();
  const router = useRouter();

  const [project, setProject] = useState<any>(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Recargar datos al entrar (para ver cambios de edición)
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [idProject])
  );

  const loadData = async () => {
    setLoading(true);
    // Cargamos proyecto y facturas en paralelo
    const [projectData, invoicesData] = await Promise.all([
      getProjectById(idProject),
      getInvoicesByProject(idProject),
    ]);

    setProject(projectData);
    setInvoices(invoicesData);
    setLoading(false);
  };

  // Calcular porcentaje visual según estado
  const getProgress = (status: string) => {
    if (status === "Completed") return 100;
    if (status === "In Progress") return 50;
    return 0; // Pending
  };

  const handleDelete = () => {
    Alert.alert("Borrar Proyecto", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const success = await deleteProject(idProject);
          if (success) router.back(); // Volvemos al cliente
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
  if (!project) return <Text style={{ padding: 20 }}>Project not found</Text>;

  const progress = getProgress(project.status);

  return (
    <ScrollView style={styles.container}>
      {/* TARJETA DE PROYECTO */}
      <View style={styles.card}>
        {/* Cabecera con Título y Botones */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <View
              style={[
                styles.badge,
                project.status === "Pending" ? styles.bgYellow : styles.bgBlue,
              ]}
            >
              <Text style={styles.badgeText}>{project.status}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            {/* LÁPIZ: Editar (Lleva a la pantalla que cambia el estado) */}
            <Pressable
              onPress={() =>
                router.push(
                  `/projects/editProject?projectId=${project.id}` as any
                )
              }
            >
              <Ionicons name="create-outline" size={24} color="#3B82F6" />
            </Pressable>
            {/* BASURA: Borrar */}
            <Pressable onPress={handleDelete}>
              <Ionicons name="trash-outline" size={24} color="#EF4444" />
            </Pressable>
          </View>
        </View>

        <Text style={styles.price}>{project.price} €</Text>

        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text style={styles.dateText}>Deadline: {project.deadline}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.label}>Description</Text>
        <Text style={styles.description}>
          {project.description || "No description provided."}
        </Text>

        {/* BARRA DE PROGRESO */}
        <View style={{ marginTop: 20 }}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressLabel}>{progress}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>

      {/* SECCIÓN FACTURAS */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Invoices ({invoices.length})</Text>
        <Pressable
          style={styles.addButton}
          onPress={() =>
            router.push(`/invoices/newInvoice?projectId=${idProject}` as any)
          }
        >
          <Ionicons name="add" size={16} color="white" />
          <Text style={styles.addButtonText}>New Invoice</Text>
        </Pressable>
      </View>

      {/* LISTA DE FACTURAS */}
      {invoices.length === 0 ? (
        <Text style={{ color: "gray", textAlign: "center", marginTop: 20 }}>
          No invoices yet.
        </Text>
      ) : (
        invoices.map((inv: any) => (
          <Pressable
            key={inv.id}
            style={styles.invoiceCard}
            onPress={() => router.push(`/invoices/${inv.id}` as any)}
          >
            <View>
              <Text style={styles.invoiceNum}>{inv.number}</Text>
              <Text style={styles.dateText}>{inv.date}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.invoiceAmount}>{inv.amount} €</Text>
              <Text
                style={[
                  styles.statusText,
                  inv.status === "Paid"
                    ? { color: "green" }
                    : { color: "orange" },
                ]}
              >
                {inv.status}
              </Text>
            </View>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  actions: { flexDirection: "row", gap: 15 },

  projectTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 5,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bgYellow: { backgroundColor: "#FEF3C7" },
  bgBlue: { backgroundColor: "#DBEAFE" },
  badgeText: { fontSize: 12, fontWeight: "bold", color: "#374151" },

  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7C3AED",
    marginBottom: 10,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 15,
  },
  dateText: { color: "#6B7280" },

  divider: { height: 1, backgroundColor: "#E5E7EB", marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "600", color: "#9CA3AF", marginBottom: 5 },
  description: { fontSize: 16, color: "#374151", lineHeight: 24 },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  progressLabel: { fontSize: 12, color: "#6B7280" },
  progressBarBg: {
    height: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", backgroundColor: "#8B5CF6" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#374151" },
  addButton: {
    backgroundColor: "#8B5CF6",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: { color: "white", fontSize: 12, fontWeight: "bold" },

  invoiceCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  invoiceNum: { fontSize: 16, fontWeight: "bold", color: "#374151" },
  invoiceAmount: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  statusText: { fontSize: 12, fontWeight: "bold" },
});
