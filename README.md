````markdown
# WorkPad

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Expo](https://img.shields.io/badge/Expo-~54.0.25-000020.svg?style=flat&logo=expo)
![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB.svg?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6.svg?style=flat&logo=typescript)

Aplicación móvil multiplataforma para freelancers que necesitan gestionar clientes, proyectos y facturas de forma organizada. Desarrollada con React Native y Expo como proyecto final de PGL.

---

## Índice

- [Sobre el proyecto](#sobre-el-proyecto)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura](#estructura)
- [Base de datos](#base-de-datos)
- [Componentes principales](#componentes-principales)
- [Funcionalidades](#funcionalidades)
- [API](#api)
- [Scripts](#scripts)

---

## Sobre el proyecto

WorkPad es una app que permite gestionar todo el flujo de trabajo de un freelancer:

- Guardar información de clientes con foto y ubicación
- Crear proyectos asociados a cada cliente
- Generar facturas para los proyectos
- Ver un resumen de ingresos en el dashboard

La idea surgió de la necesidad de tener algo simple pero completo para organizar el trabajo freelance sin depender de aplicaciones complejas o de pago. Para gestionar mis clientes ya que tambien tengo formacion en diseño gráfico

**Nota:** Este proyecto cumple con los requisitos del módulo PGL, incluyendo CRUD completo, integración con cámara/galería, mapas y conexión a API externa (Supabase).

---

## Tecnologías

### Stack principal

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-~54.0.25-000020?style=for-the-badge&logo=expo&logoColor=white)

### Navegación

![React Navigation](https://img.shields.io/badge/React_Navigation-7.1.8-6B52AE?style=for-the-badge&logo=react-router&logoColor=white)
![Expo Router](https://img.shields.io/badge/Expo_Router-6.0.15-000020?style=for-the-badge&logo=expo&logoColor=white)

### Backend

![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

**Librerías destacables:**

- `expo-image-picker` - Para cámara y galería
- `expo-location` - Geolocalización
- `react-native-maps` - Mapas interactivos
- `@expo/vector-icons` - Iconos (Ionicons)

---

## Requisitos

- Node.js >= 18.x
- npm o yarn
- Cuenta en Supabase (gratis)
- Para móvil: Expo Go instalado en el dispositivo

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/workpad.git
cd workpad

# Instalar dependencias
npm install

# Iniciar el proyecto
npm start
```
````

---

## Configuración

### 1. Crear proyecto en Supabase

Ve a [supabase.com](https://supabase.com) y crea un proyecto nuevo.

### 2. Configurar las tablas

Ejecuta estos SQL en el editor de Supabase:

```sql
-- Tabla de clientes
CREATE TABLE clientes (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  address TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de proyectos
CREATE TABLE proyectos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  deadline DATE,
  status TEXT DEFAULT 'Pending',
  client_id BIGINT REFERENCES clientes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de facturas
CREATE TABLE facturas (
  id BIGSERIAL PRIMARY KEY,
  number TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  status TEXT DEFAULT 'Pending',
  project_id BIGINT REFERENCES proyectos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Crear bucket de Storage

En Supabase → Storage → Create bucket:

- Nombre: `logos`
- Público: Sí

### 4. Configurar credenciales

Edita `services/api.ts` con tus datos:

```typescript
const SUPABASE_URL = "https://tu-proyecto.supabase.co";
const SUPABASE_KEY = "tu-clave-anon-aqui";
```

> **Importante:** No subas las claves al repo público. En mi caso las dejé por ser un proyecto de clase, pero en producción deberían estar en variables de entorno.

---

## Estructura

```
workpad/
├── app/
│   ├── (tabs)/              # Pestañas principales
│   ├── clients/             # CRUD de clientes
│   ├── projects/            # CRUD de proyectos
│   └── invoices/            # CRUD de facturas
├── components/              # Componentes reutilizables
│   ├── Button.tsx
│   ├── ClientCard.tsx
│   ├── Input.tsx
│   ├── InvoiceCard.tsx
│   └── ProjectCard.tsx
├── services/
│   └── api.ts              # Funciones para Supabase
└── assets/
```

El proyecto usa **Expo Router**, así que la navegación se basa en la estructura de carpetas dentro de `app/`.

---

## Base de datos

### Relación entre tablas

```
Cliente (1) → (N) Proyectos (1) → (N) Facturas
```

Cada cliente puede tener varios proyectos, y cada proyecto puede tener varias facturas.

### Tipos principales

```typescript
interface Client {
  id: number;
  nombre: string;
  email: string | null;
  telefono: string | null;
  lat?: number;
  lng?: number;
  logo_url: string | null;
}

interface Project {
  id: number;
  title: string;
  description: string;
  price: number;
  deadline: string;
  status: "Pending" | "In Progress" | "Completed";
  client_id: number;
}

interface Invoice {
  id: number;
  number: string;
  amount: number;
  date: string;
  status: "Pending" | "Paid";
  project_id: number;
}
```

---

## Componentes principales

Creé estos componentes para reutilizarlos en toda la app:

### Button

Botón personalizable con 3 variantes (primary, secondary, danger), estados de carga y soporte para iconos.

```tsx
<Button
  title="Guardar"
  onPress={handleSave}
  loading={isLoading}
  variant="primary"
  icon="save-outline"
/>
```

### ClientCard

Tarjeta que muestra la info del cliente. Si tiene logo lo muestra, si no pone un icono por defecto. También formatea el teléfono automáticamente.

```tsx
<ClientCard
  client={client}
  onPress={() => router.push(`/clients/${client.id}`)}
/>
```

### Input

Input con label incluido. Simplifica los formularios.

```tsx
<Input
  label="Nombre"
  placeholder="Introduce el nombre..."
  value={name}
  onChangeText={setName}
/>
```

### ProjectCard

Muestra el proyecto con un badge de color según el estado y una barra de progreso visual (0%, 50%, 100%).

### InvoiceCard

Lista las facturas con colores: verde si está pagada, naranja si está pendiente.

---

## Funcionalidades

### Dashboard

- Muestra el total de ingresos (suma de facturas con estado "Paid")
- Contadores de clientes, proyectos y facturas
- Navegación rápida a cada sección

### Clientes

- **Crear**: Formulario con nombre, email, teléfono, foto (cámara/galería) y ubicación (mapa)
- **Listar**: Búsqueda en tiempo real por nombre o email
- **Ver detalle**: Info completa + mapa + proyectos asociados
- **Editar**: Modificar cualquier campo
- **Eliminar**: Borra el cliente (y en cascada sus proyectos y facturas)

### Proyectos

- **Crear**: Asociado a un cliente, con título, descripción, precio, fecha y estado
- **Listar**: Vista global o filtrada por cliente
- **Ver detalle**: Info + facturas del proyecto
- **Editar**: Cambiar título, descripción, precio, fecha o estado
- **Eliminar**: Borra el proyecto y sus facturas

### Facturas

- **Crear**: Número, monto, fecha y estado
- **Listar**: Vista global o por proyecto
- **Ver detalle**: Info completa
- **Editar**: Cambiar monto, fecha o estado
- **Eliminar**: Borrar factura

**Detalle importante:** Cuando una factura pasa a "Paid", se actualiza automáticamente el total en el dashboard.

---

## API

Uso Supabase REST API con `fetch`. Todos los endpoints están en `services/api.ts`.

### Ejemplos de uso

**Obtener clientes:**

```typescript
const clients = await getClients();
```

**Crear cliente:**

```typescript
await insertClient({
  name: "Empresa S.A.",
  email: "contacto@empresa.com",
  phone: "+34600123456",
  lat: 28.1234,
  lng: -16.5678,
  logo: "file:///path/to/image.jpg",
});
```

**Actualizar proyecto:**

```typescript
await updateProject(projectId, {
  title: "Nuevo título",
  status: "Completed",
});
```

### Subida de imágenes

Las imágenes se suben al bucket `logos` de Supabase Storage usando FormData:

```typescript
const uploadImage = async (localUri) => {
  const formData = new FormData();
  formData.append("file", {
    uri: localUri,
    name: "logo.jpg",
    type: "image/jpeg",
  });

  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/logos/filename`,
    {
      method: "POST",
      headers: {
        /* auth headers */
      },
      body: formData,
    }
  );

  return `${SUPABASE_URL}/storage/v1/object/public/logos/filename`;
};
```

---

## Scripts

```bash
# Iniciar en modo desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS (solo Mac)
npm run ios

# Ejecutar en web
npm run web

# Linter
npm run lint
```

---

## Plataformas

- iOS (13.0+)
- Android (API 21+)
- Web

Probado principalmente en Android con Expo Go durante el desarrollo.

---

## Mejoras futuras

Cosas que me gustaría añadir si tuviera más tiempo:

- [ ] Autenticación con usuarios
- [ ] Exportar facturas a PDF
- [ ] Notificaciones para fechas límite de proyectos
- [ ] Gráficos de ingresos mensuales
- [ ] Modo oscuro
- [ ] Sincronización offline

---

## Notas del desarrollo

**Problemas encontrados:**

- Al principio tuve problemas con la subida de imágenes porque no configuré bien el FormData
- La búsqueda de clientes fallaba con valores null, lo solucioné usando `|| ""` en el filtro
- Tuve que ajustar los tipos de TypeScript varias veces hasta que todo compiló sin errores

**Lo que más me costó:**

- Entender el sistema de rutas de Expo Router (muy diferente a React Navigation clásico)
- Configurar correctamente las foreign keys en Supabase para el DELETE CASCADE

**Lo que más me gustó:**

- Ver cómo todo se conecta (cliente → proyecto → factura)
- El resultado visual con las tarjetas y colores
- Que funcione en móvil, web y todo desde el mismo código

---

## Autor

## Aridane Quevedo Cabrera 2DAM

## Recursos útiles

- [Documentación de Expo](https://docs.expo.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [React Native Docs](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**WorkPad** - Gestión simple para freelancers

```

```
