# Copilot Instructions for AI Agents

## Arquitectura General
- Proyecto basado en Next.js (estructura de carpetas `src/app`, componentes en `src/components`, servicios en `service/`).
- El flujo principal de la app está en `src/app/`, con subrutas para autenticación, dashboard, usuarios, estaciones, etc.
- Los servicios de comunicación con la API están en `service/` (`api.ts`, `authService.ts`, `registerUser.ts`).
- Los endpoints y constantes se definen en `constants/api-endpoints.ts`.
- Tipos TypeScript compartidos en `types/index.ts`.

## Convenciones y Patrones
- Usa componentes funcionales y hooks de React (`useContext`, `useState`, etc.).
- Contexto de autenticación en `contexts/AuthContext.tsx`.
- Los estilos globales están en `src/styles/globals.css`.
- Las páginas siguen la convención de Next.js: cada carpeta bajo `src/app/` representa una ruta.
- Para nuevas páginas, crea un archivo `page.tsx` en la ruta deseada.
- Imágenes y assets en `public/`.

## Flujos de Desarrollo
- **Desarrollo local:**
  ```bash
  npm run dev
  ```
- **Compilación:**
  ```bash
  npm run build
  ```
- **Variables de entorno:**
  Usa `.env.local` para credenciales y endpoints sensibles.
- **Validación de formularios:**
  Usa esquemas en `service/fuelStationCreateSchema.ts`.

## Integraciones y Comunicación
- Comunicación con backend vía servicios en `service/`.
- Los endpoints se centralizan en `constants/api-endpoints.ts`.
- El contexto de usuario y autenticación se gestiona en `contexts/AuthContext.tsx`.

## Ejemplo de patrón de servicio
```ts
// service/api.ts
export async function fetchData(endpoint: string) {
  const res = await fetch(endpoint);
  return res.json();
}
```

## Recomendaciones para agentes
- Mantén la estructura modular y reutiliza componentes.
- Consulta los servicios existentes antes de crear nuevos endpoints o lógica de negocio.
- Sigue las convenciones de rutas y carpetas para nuevas páginas o componentes.
- Documenta cambios relevantes en el README.md.

---
¿Falta alguna convención o flujo importante? Indica qué se debe mejorar o aclarar.
