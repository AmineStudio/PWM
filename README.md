# 🍔 Tahm King — Plataforma de Pedidos Online

Aplicación web completa para gestión de pedidos de un restaurante de comida rápida, desarrollada con **Angular 21** y conectada en tiempo real con **Firebase Firestore**.

---

## 📁 Índice

1. [Estructura del código](#-estructura-del-código)
2. [Estructura de datos en Firebase](#-estructura-de-datos-en-firebase)
3. [Tour por la web](#-tour-por-la-web)
4. [Instalación y puesta en marcha](#-instalación-y-puesta-en-marcha)

---

## 🗂 Estructura del código

```
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   │   ├── header/          # Cabecera con navegación y menú de usuario
│   │   ├── footer/          # Pie de página con horarios y redes sociales
│   │   └── sidebar/         # Menú lateral deslizante
│   │
│   ├── pages/               # Páginas de la aplicación
│   │   ├── inicio/          # Página principal con sliders
│   │   ├── carta/           # Catálogo de productos filtrable
│   │   ├── carrito/         # Resumen y confirmación del pedido
│   │   ├── tipo-pedido/     # Selección del tipo de pedido
│   │   ├── historial/       # Historial de pedidos del usuario
│   │   ├── login/           # Autenticación (login y registro)
│   │   ├── contacto/        # Formulario de contacto
│   │   ├── alergenos/       # Información de alérgenos
│   │   └── sobre-nosotros/  # Información del restaurante y ubicaciones
│   │
│   └── services/            # Servicios de lógica de negocio
│       ├── firestore.service.ts   # Acceso a Firestore en tiempo real
│       ├── auth.ts                # Autenticación con Firebase Auth
│       ├── carrito.service.ts     # Estado del carrito (Angular Signals)
│       └── nav.service.ts         # Control del sidebar
│
├── assets/
│   ├── img/                 # Imágenes de productos y UI
│   └── data/
│       └── data.json        # Datos originales (fuente del seed)
│
└── environments/
    ├── environment.ts       # Configuración Firebase (desarrollo)
    └── environment.prod.ts  # Configuración Firebase (producción)
```

---

### 🧩 Componentes y su funcionalidad

#### Componentes compartidos

| Componente | Descripción |
|---|---|
| `HeaderComponent` | Cabecera fija con logo, botón "Pedir Ya" y menú de usuario. Muestra el nombre del usuario logueado, sus puntos y opciones de logout/historial. |
| `FooterComponent` | Pie de página con horarios, redes sociales y enlaces legales. |
| `SidebarComponent` | Menú lateral que se despliega desde la izquierda con navegación completa. Se controla mediante `NavService`. |

#### Páginas

| Página | Ruta | Descripción |
|---|---|---|
| `InicioComponent` | `/` | Página de bienvenida con sliders (Swiper.js) de productos destacados y ofertas. |
| `CartaComponent` | `/carta` | Catálogo completo con filtros por categoría. Botones para añadir al carrito con controles de cantidad. Botón flotante con total acumulado. |
| `CarritoComponent` | `/carrito` | Resumen del pedido con lista de productos, cantidades editables y total. Confirma el pedido guardándolo en Firestore. |
| `TipoPedidoComponent` | `/tipo-pedido` | Selección del modo de pedido: comer aquí, para llevar o a domicilio. Datos cargados desde Firestore. |
| `HistorialComponent` | `/historial` | Muestra el perfil del usuario (nombre y puntos) y todos sus pedidos en tiempo real. Si no está logueado, invita a iniciar sesión. |
| `LoginComponent` | `/login` | Formulario de login y registro con Firebase Auth. Traduce los códigos de error a mensajes en español. |
| `ContactoComponent` | `/contacto` | Formulario de contacto con selección de tipo (duda, sugerencia, reclamación). Los mensajes se guardan en Firestore. |
| `AlergenosComponent` | `/alergenos` | Listado de alérgenos con imagen y descripción, cargado desde Firestore. |
| `SobreNosotrosComponent` | `/sobre-nosotros` | Historia del restaurante y mapa interactivo con las ubicaciones, cargadas desde Firestore. |

#### Servicios

| Servicio | Descripción |
|---|---|
| `FirestoreService` | Servicio central que usa el SDK de Firebase directamente. Expone observables en tiempo real mediante `onSnapshot` para todas las colecciones. |
| `AuthService` | Gestiona login, registro y logout con Firebase Auth. Expone `usuarioActual$` como un `Observable<User \| null>`. |
| `CarritoService` | Estado reactivo del carrito usando **Angular Signals**. Expone `items`, `total` y `totalItems` como señales computadas. Métodos: `agregar`, `restar`, `eliminar`, `vaciar`. |
| `NavService` | Controla el estado abierto/cerrado del sidebar con un `signal`. |

---

## 🔥 Estructura de datos en Firebase

El proyecto usa **Cloud Firestore** con las siguientes colecciones:

### 📦 `productos`

```json
{
  "id": 1,
  "nombre": "King Burger",
  "descripcion": "Doble carne, queso cheddar y bacon.",
  "precio": 12,
  "categoria_id": 2,
  "alergenos": ["gluten", "lacteos", "huevo"],
  "imagen": "img/hamburguesas/h2.jpeg",
  "disponible": true,
  "destacado": true,
  "puntos_requeridos": 1200
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | number | Identificador único |
| `precio` | number | Precio en euros |
| `categoria_id` | number | Referencia a `categorias` |
| `alergenos` | string[] | Lista de alérgenos |
| `disponible` | boolean | Aparece en la carta |
| `destacado` | boolean | Aparece en el slider de inicio |
| `puntos_requeridos` | number | Puntos para canjear |

---

### 📂 `categorias`

```json
{ "id": 2, "nombre": "Hamburguesas", "slug": "hamburguesas", "orden": 2 }
```

Categorías disponibles: **Entrantes, Hamburguesas, Hot Dogs, Bebidas, Postres, Ofertas**.

---

### 🧾 `pedidos`

```json
{
  "usuario_id": "uid-firebase-auth",
  "fecha": "03/05/2026",
  "estado": "pendiente",
  "total": 27.99,
  "tipo_pedido": "aqui",
  "createdAt": "Timestamp",
  "productos": [
    { "producto_id": 1, "cantidad": 1, "precio_unitario": 12 },
    { "producto_id": 4, "cantidad": 2, "precio_unitario": 6 }
  ]
}
```

| Estado | Significado |
|---|---|
| `pendiente` | Recién confirmado |
| `en preparación` | En cocina |
| `listo` | Listo para entregar |
| `entregado` | Completado |
| `cancelado` | Cancelado |

---

### 👤 `usuarios`

```json
{
  "nombre": "Miguel Corimanya",
  "email": "miguel@tahmking.com",
  "puntos": 100,
  "pedidos": [67, 37]
}
```

> El documento se identifica por el **UID de Firebase Auth**.

---

### 🗂 Otras colecciones

| Colección | Contenido |
|---|---|
| `alergenos` | Nombre, descripción e icono de cada alérgeno |
| `tipos_pedido` | Las 3 opciones de pedido con texto e imagen |
| `ubicaciones` | Dirección, teléfono y URL del mapa por local |
| `mensajes_contacto` | Mensajes del formulario de contacto |
| `config/site` | Nombre y datos generales del restaurante |

---

### 🔒 Reglas de Firestore

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

> ⚠️ En producción se recomienda restringir la escritura con `request.auth != null`.

---

## 🌐 Tour por la web

### 1. Página de inicio `/`

Página principal con tres sliders animados: hero, productos destacados y combos/ofertas. Los datos de productos y ofertas se cargan en tiempo real desde Firestore.

### 2. Selección del tipo de pedido `/tipo-pedido`

Al pulsar **"PEDIR YA"** en el header, se elige cómo se quiere el pedido (comer aquí, para llevar, a domicilio). La selección se guarda en `sessionStorage`.

### 3. Carta y catálogo `/carta`

Muestra todos los productos disponibles en cuadrícula con filtros por categoría.

- Pulsa una categoría para filtrar — los resultados se actualizan al instante
- Pulsa **"Añadir"** en una tarjeta — aparecen controles `−` y `+` para la cantidad
- El **botón flotante** aparece en la esquina inferior derecha con el total acumulado

#### ✏️ Ejemplo: añadir un producto desde Firebase Console

Ve a **Firestore → productos → Añadir documento** y usa este JSON:

```json
{
  "id": 32,
  "nombre": "BBQ Bacon Burger",
  "descripcion": "Carne wagyu, bacon crujiente y salsa BBQ artesana.",
  "precio": 16,
  "categoria_id": 2,
  "alergenos": ["gluten", "lacteos"],
  "imagen": "img/hamburguesas/h2.jpeg",
  "disponible": true,
  "destacado": false,
  "puntos_requeridos": 1600
}
```

Al guardar, **el producto aparece automáticamente en la carta sin recargar la página**, gracias al listener `onSnapshot` de Firestore.

Para verlo en el slider de inicio, pon `"destacado": true` — aparecerá en el slider de productos destacados de inmediato.

### 4. Carrito `/carrito`

Muestra el resumen con imagen, nombre, precio y cantidad de cada producto. Controles para editar cantidades o eliminar artículos. Al pulsar **"Confirmar pedido"**, el pedido se guarda en Firestore y redirige al historial.

### 5. Historial `/historial`

Si estás **logueado**:
- Muestra tu avatar, nombre y puntos acumulados
- Lista todos tus pedidos en tiempo real (filtrados por `usuario_id == uid`)
- Cada pedido tiene un color según su estado y un botón para ver el detalle

Si **no estás logueado**:
- Muestra un mensaje con enlace al login

### 6. Login y registro `/login`

Dos modos con toggle:
- **Iniciar sesión** — email + contraseña
- **Registrarse** — crea una nueva cuenta

Tras el login, el header muestra automáticamente el nombre del usuario con menú desplegable (puntos, historial, logout).

### 7. Contacto `/contacto`

Selecciona el tipo de mensaje y rellena el formulario. Al enviar, el mensaje se guarda en la colección `mensajes_contacto` de Firestore y se muestra una confirmación.

### 8. Alérgenos `/alergenos`

Listado de todos los alérgenos del menú, cargados en tiempo real desde Firestore.

### 9. Sobre nosotros `/sobre-nosotros`

Historia del restaurante y selector de ubicaciones. Al pulsar una ubicación, el mapa de Google Maps se actualiza con la dirección tomada desde Firestore.

---

## ⚙️ Instalación y puesta en marcha

### Requisitos

- Node.js 20+
- Angular CLI 21

### Pasos

```bash
# 1. Instalar dependencias
npm install --legacy-peer-deps

# 2. Subir datos a Firestore (solo la primera vez)
npm install firebase-admin --legacy-peer-deps
# Coloca serviceAccountKey.json en la raíz del proyecto
node seed-firestore.mjs

# 3. Iniciar el servidor de desarrollo
npm start
```

Disponible en `http://localhost:4200`.

---

## 🛠 Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 21.2 | Framework frontend |
| TypeScript | 5.9 | Lenguaje de programación |
| Firebase SDK | 12.x | Comunicación con Firebase |
| Cloud Firestore | — | Base de datos en tiempo real |
| Firebase Auth | — | Autenticación de usuarios |
| RxJS | 7.8 | Programación reactiva |
| Swiper.js | 12.x | Sliders |
| Angular Signals | built-in | Estado reactivo del carrito |

---

## 👥 Equipo

Proyecto desarrollado como práctica de Desarrollo Web — curso 2024/2025.
