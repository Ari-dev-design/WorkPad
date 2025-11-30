import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getAllInvoices, getAllProjects, getClients } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    clients: 0,
    projects: 0,
    revenue: "0 €",
  });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    setLoading(true);

    const [clientsData, projectsData, invoicesData] = await Promise.all([
      getClients(),
      getAllProjects(),
      getAllInvoices(),
    ]);

    const totalRevenue = invoicesData.reduce(
      (sum: number, inv: any) => sum + (parseFloat(inv.amount) || 0),
      0
    );

    setStats({
      clients: clientsData.length,
      projects: projectsData.length,
      revenue: `${totalRevenue.toFixed(2)} €`, // Mostramos 2 decimales
    });
    setLoading(false);
  };

  const MenuButton = ({ title, icon, color, route, subtitle }: any) => (
    <Pressable style={styles.menuCard} onPress={() => router.push(route)}>
      <View style={[styles.iconCircle, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="white" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
    </Pressable>
  );

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>WorkPad</Text>
          <Text style={styles.subGreeting}>Work Summary</Text>
        </View>
        <View style={styles.avatar}>
          <Ionicons name="person" size={20} color="#64748B" />
        </View>
      </View>

      {/* RESUMEN (STATS) */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.clients}</Text>
          <Text style={styles.statLabel}>Clients</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.projects}</Text>
          <Text style={styles.statLabel}>Projects</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: "#10B981" }]}>
            {stats.revenue}
          </Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Main Menu</Text>

      {/* BOTONES DE NAVEGACIÓN */}
      <View style={styles.menuGrid}>
        <MenuButton
          title="Clients"
          subtitle="Manager"
          icon="people"
          color="#7C3AED"
          route="/clients/"
        />

        <MenuButton
          title="Projects"
          subtitle="Project Progress"
          icon="briefcase"
          color="#f63bbeff"
          route="/projects/"
        />

        <MenuButton
          title="Invoices"
          subtitle="Payment History"
          icon="receipt"
          color="#F59E0B"
          route="/invoices/"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 40,
  },
  greeting: { fontSize: 28, fontWeight: "bold", color: "#1E293B" },
  subGreeting: { fontSize: 16, color: "#64748B" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 30 },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    textTransform: "uppercase",
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 15,
  },

  menuGrid: { gap: 15 },
  menuCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTitle: { fontSize: 16, fontWeight: "bold", color: "#1E293B" },
  menuSubtitle: { fontSize: 13, color: "#64748B" },
});
