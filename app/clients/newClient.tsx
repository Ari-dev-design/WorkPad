import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
// IMPORTAMOS LOS NUEVOS COMPONENTES
import Button from "../../components/Button";
import Input from "../../components/Input";
import { insertClient } from "../../services/api";
// Importamos el Mapa
import MapView, { Marker } from "react-native-maps";

export default function NewClient() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    logo: null as string | null,
    lat: 0 as number | null,
    lng: 0 as number | null,
  });

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
      Alert.alert("Error", "Teléfono inválido. Formato: (+34) + 9 dígitos.");
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

  const getCurrentLocation = async () => {
    setUploading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") throw new Error("Permission denied");

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

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    const success = await insertClient(form);
    setSaving(false);
    if (success) {
      Alert.alert("Éxito", "Cliente creado", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* SECCIÓN FOTO */}
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

      {/* FORMULARIO CON COMPONENTES REUTILIZABLES */}
      <Input
        label="Name *"
        value={form.name}
        onChangeText={(t) => setForm({ ...form, name: t })}
        placeholder="Name"
      />

      <Input
        label="Email"
        value={form.email}
        onChangeText={(t) => setForm({ ...form, email: t })}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="user@mail.com"
      />

      <Input
        label=""
        value={form.phone}
        onChangeText={(text) =>
          setForm({ ...form, phone: text.replace(/[^0-9+]/g, "") })
        }
        keyboardType="phone-pad"
        maxLength={15}
        placeholder=""
      />

      {/* MAPA */}
      <Text style={styles.labelMap}>Location</Text>
      <View style={styles.mapContainer}>
        {form.lat && form.lng ? (
          <MapView
            style={styles.map}
            region={{
              latitude: form.lat,
              longitude: form.lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{ latitude: form.lat, longitude: form.lng }}
              title="Nuevo Cliente"
            />
          </MapView>
        ) : (
          <View style={styles.noMap}>
            <Ionicons name="map-outline" size={30} color="#9f03faff" />
            <Text style={{ color: "#9f03faff" }}>Sin ubicación</Text>
          </View>
        )}

        {/* Botón flotante pequeño (GPS) */}
        <Button
          title={uploading ? "GPS..." : "Get GPS"}
          onPress={getCurrentLocation}
          icon="location"
          variant="secondary"
          style={styles.gpsButtonOverlay}
          disabled={uploading}
        />
      </View>

      {/* BOTÓN GUARDAR REUTILIZABLE */}
      <Button
        title="Create Client"
        onPress={handleSave}
        loading={saving}
        style={{ marginBottom: 40 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  // Estilos Foto
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

  // Estilos Mapa
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

  // Ajuste para botón flotante usando nuestro componente Button
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
