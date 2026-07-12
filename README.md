# Tahm King · RestauranteApp — Proyecto de Programación Web y Móvil (PWM)

Repositorio del proyecto de la asignatura **Programación Web y Móvil (PWM)** del Grado en Ingeniería Informática (Universidad de Las Palmas de Gran Canaria).

El proyecto se desarrolló como **trabajo en equipo** y de forma **incremental a lo largo de 4 sprints**, siendo cada sprint una entrega evaluable de la asignatura. Cada sprint está en su propia rama del repositorio.

## Equipo

- Miguel Alonso Corimanya Rojas
- Yenedey Morán Delgado
- Amine Allah Saidani

## Descripción general

El grueso del proyecto (sprints 1 a 3) es **Tahm King**, una plataforma digital para un restaurante de comida rápida, que muestra un catálogo de productos (entrantes, hamburguesas, hot dogs, complementos, postres y bebidas) y permite pedir de tres formas distintas: para comer en el local, para llevar o a domicilio. A lo largo de los sprints, esta aplicación evoluciona de una web estática a una aplicación Angular.

El **sprint 4** es un proyecto independiente (**RestauranteApp**) centrado en aprender el desarrollo de aplicaciones móviles con Ionic, Firebase y persistencia local. No comparte código ni temática con los sprints anteriores.

## Evolución por sprints

Cada sprint corresponde a una rama del repositorio.

### Sprint 1 — `sprint1` · Tahm King (web estática)

Primera versión de la web de Tahm King desarrollada con **HTML, CSS y JavaScript** puros. Incluye las páginas principales (inicio, carta, alérgenos, contacto, historial, login, ofertas, tipo de pedido, "sobre nosotros", ticket y pedido), componentes reutilizables (header, footer y sidebar) inyectados mediante JavaScript, y los estilos del sitio. El diseño se basa en los mockups y storyboards elaborados en Figma.

**Tecnologías:** HTML · CSS · JavaScript · Figma · Trello · WebStorm

### Sprint 2 — `Sprint2` · Tahm King (contenido dinámico)

Continúa sobre la web estática y añade la carga de contenido desde un fichero **`data.json`** (información del sitio, menú, footer, horarios y enlaces), además de una carpeta de documentos legales en PDF (política de privacidad, términos de uso y política de cookies).

**Tecnologías:** HTML · CSS · JavaScript · JSON

### Sprint 3 — `Sprint3` · Tahm King (migración a Angular)

Reescritura de la aplicación con **Angular** (Angular CLI 21, componentes standalone). Las páginas anteriores se reorganizan en componentes Angular (inicio, carta, alérgenos, contacto, historial, login, sobre-nosotros y tipo-pedido), con enrutado, un servicio de navegación basado en signals, carruseles con Swiper y renderizado en servidor (SSR). Se preparan también los proveedores de Firebase (Auth y Firestore).

**Tecnologías:** Angular 21 · TypeScript · Angular SSR · Swiper · Firebase

> **Nota sobre la instalación de este sprint:** el `package.json` usa una versión *canary* de `@angular/fire`, lo que provoca un conflicto de dependencias (`ERESOLVE`) al hacer `npm install`. Para instalar correctamente, ejecuta:
> ```bash
> npm install --legacy-peer-deps
> ```
> (O añade `legacy-peer-deps=true` a un fichero `.npmrc` en la raíz para que `npm install` funcione sin la bandera.)

### Sprint 4 — `Sprint4` (= `main`) · RestauranteApp (Ionic + Firebase + SQLite)

Aplicación móvil independiente construida con **Ionic + Angular + Capacitor**. Funcionalidades:

- **Autenticación** con Firebase Auth (registro, inicio y cierre de sesión), con el perfil de usuario almacenado en Firestore.
- **Rutas protegidas** mediante un `AuthGuard` que redirige al login si no hay sesión iniciada.
- **Listado y detalle de restaurantes** leídos de forma reactiva desde Cloud Firestore.
- **Favoritos** guardados localmente en el dispositivo con **SQLite** (`@capacitor-community/sqlite`), con soporte también en web.
- **Multiplataforma** gracias a Capacitor (incluye el proyecto Android).

**Tecnologías:** Ionic 8 · Angular 20 · Capacitor 8 · Firebase 11 / AngularFire · SQLite · TypeScript

## Estado del proyecto

Este es un proyecto **académico y en desarrollo**, por lo que la aplicación **puede necesitar algunas correcciones** y contener errores pendientes de resolver. En concreto:

- Algunas páginas pueden mostrar errores de compilación por comprobaciones estrictas de TypeScript (por ejemplo, expresiones del tipo `valor?.length > 0` que conviene reescribir como `(valor?.length ?? 0) > 0`).
- Parte del trabajo puede encontrarse en las ramas de cada sprint y no estar volcado en `main`.

Se recomienda revisar y probar cada rama por separado antes de su evaluación o despliegue.

## Ramas del repositorio

- `sprint1`, `Sprint2`, `Sprint3`, `Sprint4` — entregas de cada sprint (`Sprint4` coincide con `main`).
- `feat/angular-integracion`, `feat/firebase-integracion` — ramas de integración de funcionalidades.
- `fix/errors` — correcciones.
- `master`, `rama-alonso` — ramas de trabajo adicionales.

## Requisitos

- Node.js y npm
- Angular CLI (`npm install -g @angular/cli`)
- Ionic CLI para el sprint 4 (`npm install -g @ionic/cli`)
- Una cuenta y un proyecto de Firebase (para los sprints que usan Auth y Firestore)

## Instalación y ejecución

Sitúate en la rama del sprint que quieras ejecutar (por ejemplo `git checkout Sprint4`) y, en la raíz del proyecto:

```bash
# Instalar dependencias
npm install
# (en Sprint3, usar: npm install --legacy-peer-deps)

# Servidor de desarrollo
npm start          # Angular  -> http://localhost:4200/
ionic serve        # Ionic (Sprint 4)

# Compilar para producción
npm run build
```

Para generar la aplicación Android del sprint 4 (Capacitor):

```bash
npm run build
npx cap sync android
npx cap open android
```

## Configuración de Firebase

Los sprints que usan Firebase necesitan las credenciales del proyecto en `src/environments/environment.ts`, con la forma:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {   // en el Sprint 4 la clave se llama "firebase"
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
  }
};
```

Estos valores se obtienen en la consola de Firebase, en **Configuración del proyecto -> General -> Tus apps**.

## Seguridad

Ten en cuenta lo siguiente respecto a la seguridad del proyecto:

- **Credenciales de Firebase:** las claves de configuración de Firebase (`apiKey`, `authDomain`, etc.) son identificadores de cliente y son públicas por diseño; van embebidas en cualquier app web o móvil, por lo que su exposición no compromete por sí sola el proyecto. Aun así, como buena práctica se recomienda **no versionar** `environment.ts` con las claves reales: puede mantenerse un fichero `environment.example.ts` con la estructura y valores de relleno, e ignorar el fichero real en `.gitignore`.
- **Reglas de seguridad:** la protección real de los datos **no depende de ocultar la `apiKey`**, sino de las **reglas de seguridad de Firestore** y de la configuración de Firebase Authentication. Las reglas deben restringir el acceso (por ejemplo: lectura pública del catálogo, y escritura o acceso a perfiles solo para usuarios autenticados y sobre sus propios documentos), evitando dejarlas en modo totalmente abierto (`allow read, write: if true;`).
- **Secretos sensibles:** nunca deben subirse al repositorio claves de cuentas de servicio (Admin SDK), tokens de APIs de pago ni contraseñas; esos sí son secretos reales.

## Recursos

Los README de las primeras ramas (`sprint1`, `Sprint2`) contienen enlaces adicionales al documento de requisitos, a los mockups de Figma y al vídeo de presentación del proyecto.

## Autoría

Proyecto realizado en equipo para la asignatura de Programación Web y Móvil (PWM) — Grado en Ingeniería Informática, Universidad de Las Palmas de Gran Canaria (ULPGC).
