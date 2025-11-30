import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getClientById, updateClient } from "../../services/api";

// IMPORTAMOS LOS NUEVOS COMPONENTES
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function EditClient() {
  const router = useRouter();
  const { clientId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    logo: null as string | null,
    lat: 0 as number | null,
    lng: 0 as number | null,
  });

  useEffect(() => {
    loadData();
  }, [clientId]);

  const loadData = async () => {
    const data = await getClientById(clientId);
    if (data) {
      setForm({
        name: data.nombre,
        email: data.email || "",
        phone: data.telefono || "",
        address: data.address || "",
        logo: data.logo_url || null,
        // Si viene null de la BD, usamos 0 para evitar problemas
        lat: data.lat || 0,
        lng: data.lng || 0,
      });
    } else {
      Alert.alert("Error", "Cliente no encontrado");
      router.back();
    }
    setLoading(false);
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      Alert.alert("Error", "Nombre obligatorio");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      Alert.alert("Error", "Email inválido");
      return false;
    }
    const phoneRegex = /^\+?\d{9,15}$/;
    if (form.phone && !phoneRegex.test(form.phone)) {
      Alert.alert("Error", "Teléfono inválido (+34... y 9 dígitos)");
      return false;
    }
    return true;
  };

  const pickImage = async (mode: "camera" | "gallery") => {
    const { status } =
      mode === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso a la cámara/galería."
      );
      return;
    }

    let result =
      mode === "camera"
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
          })
        : await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
          });

    if (!result.canceled) setForm({ ...form, logo: result.assets[0].uri });
  };

  // GPS INFALIBLE
  const getCurrentLocation = async () => {
    setUploading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") throw new Error("Permiso denegado");

      let location = await Location.getLastKnownPositionAsync({});

      if (!location) {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });
      }

      setForm({
        ...form,
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (error) {
      // PLAN B: Simulación
      const simLat = 28.12 + Math.random() * 0.05;
      const simLng = -15.43 + Math.random() * 0.05;

      setForm({ ...form, lat: simLat, lng: simLng });

      Alert.alert(
        "Aviso",
        "Ubicación real no disponible. Se usó una ubicación simulada."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    setSaving(true);
    const success = await updateClient(clientId, form);
    setSaving(false);
    if (success) {
      Alert.alert("Éxito", "Cliente actualizado", [
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
      {/* FOTO */}
      <View style={styles.imageSection}>
        <View style={styles.imagePreview}>
          {form.logo ? (
            <Image source={{ uri: form.logo }} style={styles.image} />
          ) : (
            <Ionicons name="person" size={40} color="#9CA3AF" />
          )}
        </View>
        <View style={styles.imageButtons}>
          <Pressable
            style={styles.iconButton}
            onPress={() => pickImage("camera")}
          >
            <Ionicons name="camera" size={20} color="#4B5563" />
            <Text style={styles.iconButtonText}>Camera</Text>
          </Pressable>
          <Pressable
            style={styles.iconButton}
            onPress={() => pickImage("gallery")}
          >
            <Ionicons name="images" size={20} color="#4B5563" />
            <Text style={styles.iconButtonText}>Gallery</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.headerTitle}>Editing Client ID: {clientId}</Text>

      <Input
        label="Name *"
        value={form.name}
        onChangeText={(t) => setForm({ ...form, name: t })}
      />

      <Input
        label="Email"
        value={form.email}
        onChangeText={(t) => setForm({ ...form, email: t })}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        label="Phone"
        value={form.phone}
        onChangeText={(text) =>
          setForm({ ...form, phone: text.replace(/[^0-9+]/g, "") })
        }
        keyboardType="phone-pad"
        maxLength={15}
        placeholder="+34..."
      />

      {/* MAPA */}
      <Text style={styles.labelMap}>Location</Text>
      <View style={styles.mapContainer}>
        {/* 👇 AQUÍ ESTÁ LA CORRECCIÓN CLAVE: Comprobar que no sea 0 👇 */}
        {form.lat !== 0 && form.lng !== 0 ? (
          <MapView
            style={styles.map}
            region={{
              latitude: form.lat || 0,
              longitude: form.lng || 0,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{ latitude: form.lat || 0, longitude: form.lng || 0 }}
              title="Cliente"
            />
          </MapView>
        ) : (
          <View style={styles.noMap}>
            <Ionicons name="map-outline" size={30} color="#ccc" />
            <Text style={{ color: "#999" }}>Sin ubicación</Text>
          </View>
        )}

        <Button
          title={uploading ? "..." : "Update GPS"}
          onPress={getCurrentLocation}
          icon="location"
          variant="secondary"
          style={styles.gpsButtonOverlay}
          disabled={uploading}
        />
      </View>

      <Button
        title="Save Changes"
        onPress={handleUpdate}
        loading={saving}
        style={{ marginBottom: 40 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  imageSection: { alignItems: "center", marginBottom: 20 },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  imageButtons: { flexDirection: "row", gap: 12 },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  iconButtonText: { fontSize: 13, fontWeight: "500", color: "#374151" },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  labelMap: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    position: "relative",
  },
  map: { width: "100%", height: "100%" },
  noMap: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
  gpsButtonOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 3,
  },
});
