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
import { getAllProjects } from "../../services/api"; // <--- Función nueva

export default function ProjectsList() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    setLoading(true);
    const data = await getAllProjects();
    setProjects(data);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Projects</Text>

      {loading ? (
        <ActivityIndicator color="#7C3AED" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item: any) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.empty}>No projects available.</Text>
          }
          contentContainerStyle={{ gap: 15, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/projects/${item.id}`)}
            >
              <View style={styles.row}>
                <Text style={styles.projectTitle}>{item.title}</Text>

                <View
                  style={[
                    styles.badge,
                    item.status === "In Progress"
                      ? styles.bgBlue
                      : styles.bgGray,
                  ]}
                >
                  <Text style={styles.badgeText}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.price}>{item.price} €</Text>
                <Text style={styles.date}>{item.deadline}</Text>
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
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  projectTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  price: { fontSize: 16, color: "#7C3AED", fontWeight: "bold" },
  date: { fontSize: 12, color: "#9CA3AF" },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  bgBlue: { backgroundColor: "#DBEAFE" },
  bgGray: { backgroundColor: "#F3F4F6" },
  badgeText: { fontSize: 12, fontWeight: "bold", color: "#374151" },
});
