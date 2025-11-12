// middleware.ts
// ======================================================
// Clerk Middleware Configuration (Next.js 16 + App Router)
// ------------------------------------------------------
// Este archivo intercepta todas las solicitudes HTTP 
// antes de que lleguen a tus rutas de la aplicación.
// Usa Clerk para proteger rutas que requieren autenticación.
// ======================================================

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

/**
 * 🔒 Define las rutas protegidas
 * 
 * Clerk solo ejecutará `auth.protect()` (que verifica la sesión del usuario)
 * cuando la solicitud coincida con alguna de estas rutas.
 * 
 * Si la ruta no está aquí listada, se considera pública por defecto.
 * 
 * Puedes usar patrones con expresiones regulares (por ejemplo '/meetings/(.*)')
 * para proteger rutas dinámicas o con subrutas.
 */
const protectedRoutes = createRouteMatcher([
  '/',                  // Página principal (dashboard o home autenticado)
  '/upcoming',          // Página de próximas reuniones
  '/previous',          // Página de reuniones anteriores
  '/recordings',        // Página de grabaciones
  '/personal-room',     // Página de sala personal
  '/meeting/(.*)',     // Cualquier ruta que empiece por /meetings/
]);

/**
 * 🧠 Middleware principal
 * 
 * - Se ejecuta en el edge (antes de renderizar la página).
 * - Revisa si la ruta solicitada está en `protectedRoutes`.
 * - Si lo está → llama a `auth.protect()` para asegurar que haya sesión activa.
 * - Si no lo está → deja pasar la solicitud libremente (ruta pública).
 * 
 * 🔍 Sobre async/await:
 * 
 * Este middleware es una función asíncrona porque `auth.protect()` realiza
 * operaciones que pueden tardar (consultar tokens, cookies o verificar
 * información del usuario con Clerk).
 * 
 * Al usar `await`, le decimos a JavaScript que **espere** a que esa verificación
 * termine antes de continuar el flujo de ejecución.
 * 
 * Así garantizamos que:
 *  - La sesión del usuario esté validada antes de que Next.js renderice la página.
 *  - Si el usuario no está autenticado, Clerk redirige correctamente al login.
 *  - No se producen condiciones de carrera (race conditions) ni respuestas incompletas.
 */
export default clerkMiddleware(async (auth, req) => {
  if (protectedRoutes(req)) {
    await auth.protect()
  }
})


/**
 * ⚙️ Configuración del matcher
 * 
 * Define qué rutas del proyecto deben pasar por este middleware.
 * 
 * - Se excluyen automáticamente los archivos estáticos de Next.js 
 *   (como JS, CSS, imágenes, fuentes, etc).
 * - Se incluye explícitamente cualquier ruta de API (`/api` o `/trpc`).
 */
export const config = {
  matcher: [
    // Evita que el middleware se ejecute en archivos estáticos o internos
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Ejecuta siempre para rutas de API
    '/(api|trpc)(.*)',
  ],
};

/**
 * 🧩 En resumen:
 * - Clerk autentica automáticamente las rutas listadas en `protectedRoutes`.
 * - Las rutas no incluidas son públicas (como `/sign-in` o `/sign-up`).
 * - `auth.protect()` redirige al usuario al login si no está autenticado.
 * - `config.matcher` optimiza qué peticiones realmente ejecutan el middleware.
 */
