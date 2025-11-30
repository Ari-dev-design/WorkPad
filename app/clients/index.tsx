import { Ionicons } from "@expo/vector-icons";
import { Link, router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getClients } from "../../services/api";

import ClientCard from "../../components/ClientCard";

interface Client {
  id: number;
  nombre: string;
  email: string | null; // Puede ser null
  telefono: string | null;
  logo_url: string | null;
}

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useFocusEffect(
    useCallback(() => {
      fetchClients();
    }, [])
  );

  const fetchClients = async () => {
    setLoading(true);
    const data = await getClients();
    setClients(data);
    setLoading(false);
  };

  const filteredClients = clients.filter((client) => {
    const term = searchText.toLowerCase();

    const name = (client.nombre || "").toLowerCase();
    const email = (client.email || "").toLowerCase();

    return name.includes(term) || email.includes(term);
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>WorkPad</Text>
          <Text style={styles.subtitle}>My Clients</Text>
        </View>

        <Link href="/clients/newClient" asChild>
          <Pressable style={styles.purpleButton}>
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.buttonText}>New</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          placeholder="Search clients..."
          style={styles.searchInput}
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={setSearchText} // Al escribir, actualiza el estado
        />
        {searchText.length > 0 && (
          <Pressable onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </Pressable>
        )}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#7C3AED"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={filteredClients} // <--- ¡IMPORTANTE! Usamos la lista filtrada
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {searchText ? "No clients match." : "No clients found yet."}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            // Usamos el componente reutilizable
            <ClientCard
              client={item}
              onPress={() => router.push(`/clients/${item.id}`)}
            />
          )}
          contentContainerStyle={{ gap: 16, paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F3F4F6" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#111827" },
  subtitle: { fontSize: 16, color: "#6B7280", marginTop: -5 },
  purpleButton: {
    backgroundColor: "#7C3AED",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    gap: 6,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  searchContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 16 },
  emptyState: { alignItems: "center", marginTop: 50 },
  emptyText: { fontSize: 18, fontWeight: "bold", color: "#374151" },
});
