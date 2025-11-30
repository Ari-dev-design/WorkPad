import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#F3F4F6" },
        headerShadowVisible: false,
        headerTintColor: "#111827",
        headerTitleStyle: { fontWeight: "bold" },
        contentStyle: { backgroundColor: "#F3F4F6" },
      }}
    >
      {/* --- DASHBOARD PRINCIPAL --- */}
      <Stack.Screen
        name="index"
        options={{ title: "WorkPad", headerShown: false }}
      />

      {/* --- SECCIÓN CLIENTES --- */}
      <Stack.Screen name="clients/index" options={{ title: "Mis Clientes" }} />
      <Stack.Screen
        name="clients/[idClient]"
        options={{ title: "Detalle Cliente" }}
      />
      <Stack.Screen
        name="clients/newClient"
        options={{ title: "Nuevo Cliente", presentation: "modal" }}
      />
      <Stack.Screen
        name="clients/editClient"
        options={{ title: "Editar Cliente", presentation: "modal" }}
      />

      {/* --- SECCIÓN PROYECTOS --- */}
      <Stack.Screen
        name="projects/index"
        options={{ title: "Todos los Proyectos" }}
      />
      <Stack.Screen
        name="projects/[idProject]"
        options={{ title: "Detalle Proyecto" }}
      />
      <Stack.Screen
        name="projects/newProject"
        options={{ title: "Nuevo Proyecto", presentation: "modal" }}
      />
      <Stack.Screen
        name="projects/editProject"
        options={{ title: "Editar Proyecto", presentation: "modal" }}
      />

      {/* --- SECCIÓN FACTURAS --- */}
      <Stack.Screen
        name="invoices/index"
        options={{ title: "Todas las Facturas" }}
      />
      <Stack.Screen
        name="invoices/newInvoice"
        options={{ title: "Nueva Factura", presentation: "modal" }}
      />
      <Stack.Screen
        name="invoices/[idInvoice]"
        options={{ title: "Detalle Factura" }}
      />
    </Stack>
  );
}
