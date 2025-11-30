import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Importamos la API
import {
  deleteClient,
  getClientById,
  getProjectsByClient,
} from "../../services/api";

export default function ClientDetail() {
  const { idClient } = useLocalSearchParams();
  const router = useRouter();

  const [client, setClient] = useState<any>(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Recargamos los datos cada vez que la pantalla gana el foco
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [idClient])
  );

  const loadData = async () => {
    setLoading(true);
    const [clientData, projectsData] = await Promise.all([
      getClientById(idClient),
      getProjectsByClient(idClient),
    ]);
    setClient(clientData);
    setProjects(projectsData);
    setLoading(false);
  };

  const handleDeleteClient = () => {
    Alert.alert(
      "Eliminar Cliente",
      "¿Estás seguro? Se borrarán sus proyectos.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const success = await deleteClient(idClient);
            if (success) router.replace("/");
          },
        },
      ]
    );
  };

  const openMap = () => {
    if (!client.lat) return Alert.alert("Info", "Sin ubicación GPS");
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${client.lat},${client.lng}`;
    const label = client.nombre;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    if (url) Linking.openURL(url);
  };

  // Función formateadora de teléfono
  const formatPhone = (phone: string) => {
    if (!phone) return "No phone";
    return phone.replace(/(\+\d{1,3})(\d{3})(\d{3})(\d{3})/, "$1 $2 $3 $4");
  };

  // --- TRUCO VISUAL: Calcular progreso según estado ---
  const getProgress = (status: string) => {
    if (status === "Completed") return 100;
    if (status === "In Progress") return 50;
    return 0; // Pending
  };

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#7C3AED"
        style={{ marginTop: 50 }}
      />
    );
  if (!client) return <Text style={{ padding: 20 }}>Client not found</Text>;

  return (
    <ScrollView style={styles.container}>
      {/* --- PARTE 1: DATOS DEL CLIENTE --- */}
      <Text style={styles.headerTitle}>Client Details</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {client.logo_url ? (
            <Image
              source={{ uri: client.logo_url }}
              style={styles.clientImage}
            />
          ) : (
            <View style={styles.iconBox}>
              <Ionicons name="business" size={32} color="white" />
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={styles.clientName}>{client.nombre}</Text>
            <Text style={styles.clientSubName}>
              {client.contact || "Contacto"}
            </Text>
          </View>

          {/* Botones Editar y Borrar */}
          <Pressable
            hitSlop={10}
            onPress={() =>
              router.push(`/clients/editClient?clientId=${client.id}` as any)
            }
          >
            <Ionicons name="create-outline" size={24} color="#3B82F6" />
          </Pressable>
          <Pressable hitSlop={10} onPress={handleDeleteClient}>
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
          </Pressable>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={18} color="#6B7280" />
          <Text style={styles.infoText}>{client.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={18} color="#6B7280" />
          <Text style={styles.infoText}>{formatPhone(client.telefono)}</Text>
        </View>

        <Pressable style={styles.infoRow} onPress={openMap}>
          <Ionicons name="location-outline" size={18} color="#6B7280" />
          <Text
            style={[
              styles.infoText,
              client.lat && {
                color: "#3B82F6",
                textDecorationLine: "underline",
              },
            ]}
          >
            {client.address ||
              (client.lat ? "Ver ubicación en Mapa" : "Sin ubicación")}
          </Text>
        </Pressable>
      </View>

      {/* --- PARTE 2: PROYECTOS CON BARRA DE PROGRESO --- */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Projects</Text>
        <Pressable
          style={styles.addButton}
          onPress={() =>
            router.push(`/projects/newProject?clientId=${client.id}` as any)
          }
        >
          <Ionicons name="add" size={16} color="white" />
          <Text style={styles.addButtonText}>New Project</Text>
        </Pressable>
      </View>

      {projects.map((project: any) => {
        const progress = getProgress(project.status);

        return (
          <Pressable
            key={project.id}
            style={styles.projectCard}
            onPress={() => router.push(`/projects/${project.id}` as any)}
          >
            {/* Cabecera Proyecto */}
            <View style={styles.projectHeader}>
              <Text style={styles.projectTitle}>{project.title}</Text>
              {/* Icono Papelera (Visual por ahora) */}
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </View>

            <Text style={styles.projectSubtitle}>
              {project.description || project.title}
            </Text>

            {/* Badge y Fecha */}
            <View style={styles.projectFooter}>
              <View
                style={[
                  styles.badge,
                  project.status === "Pending"
                    ? styles.badgeYellow
                    : styles.badgeBlue,
                ]}
              >
                <Text style={styles.badgeText}>{project.status}</Text>
              </View>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                <Text style={styles.dateText}>{project.deadline}</Text>
              </View>
            </View>

            {/* BARRA DE PROGRESO RESTAURADA */}
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressLabel}>{progress}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBarFill, { width: `${progress}%` }]}
              />
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 15,
  },

  // Card Cliente
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", gap: 15, alignItems: "flex-start" },
  clientImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
  iconBox: {
    width: 60,
    height: 60,
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  clientName: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  clientSubName: { fontSize: 14, color: "#6B7280", marginTop: 2 },

  divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 15 },
  infoRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: { color: "#4B5563", fontSize: 14 },

  // Sección Proyectos
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
    padding: 8,
    borderRadius: 8,
    gap: 4,
    alignItems: "center",
  },
  addButtonText: { color: "white", fontWeight: "bold", fontSize: 12 },

  // Tarjeta Proyecto
  projectCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  projectTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  projectSubtitle: { fontSize: 14, color: "#6B7280", marginBottom: 12 },

  projectFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeYellow: { backgroundColor: "#FEF3C7" },
  badgeBlue: { backgroundColor: "#DBEAFE" },
  badgeText: { fontSize: 12, fontWeight: "500", color: "#4B5563" },

  dateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  dateText: { fontSize: 12, color: "#9CA3AF" },

  // Estilos de Progreso
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressLabel: { fontSize: 12, color: "#6B7280" },
  progressBarBg: {
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", backgroundColor: "#8B5CF6" },
});
