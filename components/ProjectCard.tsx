import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    description?: string;
    status: string;
    deadline?: string;
  };
  onPress: () => void;
}

export default function ProjectCard({ project, onPress }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    if (status === "Completed")
      return { bg: "#D1FAE5", text: "#059669", fill: "#10B981", percent: 100 };
    if (status === "In Progress")
      return { bg: "#DBEAFE", text: "#1E40AF", fill: "#3B82F6", percent: 50 };
    return { bg: "#FEF3C7", text: "#92400E", fill: "#F59E0B", percent: 0 }; // Pending
  };

  const styleData = getStatusColor(project.status);

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{project.title}</Text>
        {/* Badge de Estado */}
        <View style={[styles.badge, { backgroundColor: styleData.bg }]}>
          <Text style={[styles.badgeText, { color: styleData.text }]}>
            {project.status}
          </Text>
        </View>
      </View>

      <Text style={styles.subtitle} numberOfLines={2}>
        {project.description || "Sin descripción"}
      </Text>

      <View style={styles.footer}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
          <Text style={styles.dateText}>{project.deadline || "Sin fecha"}</Text>
        </View>
      </View>

      {/* Barra de Progreso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${styleData.percent}%`,
                backgroundColor: styleData.fill,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{styleData.percent}%</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: "bold", color: "#111827", flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#6B7280", marginBottom: 12 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  dateText: { fontSize: 12, color: "#6B7280" },
  progressContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%" },
  progressText: {
    fontSize: 12,
    color: "#6B7280",
    width: 35,
    textAlign: "right",
  },
});
