# Thrive Academy — trayectorias personalizadas (etapa 1)

Ruta prevista: `/trayectorias`

## Implementado en GitHub / Vercel
- Selección de meta conceptual o de aplicación interdisciplinaria.
- Planificación determinista de prerrequisitos con ramas alternativas. Los vínculos son propuestas académicas, no requisitos universales.
- Autodeclaración de conocimientos previos; el alumno no queda clasificado en un tipo fijo de inteligencia.
- Progreso visual por concepto, próximo tema sugerido, microlecciones y ejercicios del prototipo.
- Puentes hacia conceptos complementarios y navegación a `/puentes`, `/fundamentos`, `/universe`.
- Interfaz de acceso con enlace al correo usando Supabase Auth.
- Código para guardar rutas, estado individual e intentos, con retroalimentación explícita cuando no se puede sincronizar.

## Pendiente de habilitación en la base
La conexión administrativa a Supabase Thrive estaba devolviendo `MCP error -32600: You do not have permission to perform this action` el 6-nov-2026.
Por ello, la migración `supabase/migrations/20261106_personalized_learning.sql` **NO se ha aplicado**.
La interfaz de `/trayectorias` se puede explorar sin iniciar sesión, pero ese avance de visitante existe solo en la memoria de la pestaña.
No afirmar que el seguimiento entre dispositivos funciona hasta aplicar la migración y verificar una sesión real de usuario.

### Para habilitarlo
1. Restaurar permisos del conector Supabase sobre la organización/proyecto Thrive `xmigmkffybigjksonwpe`. No tocar BuildIt.
2. Revisar y aplicar `20261106_personalized_learning.sql` mediante el flujo de migraciones o SQL Editor.
3. En Supabase Auth → URL Configuration, configurar como URL de producción `https://thrive-platform-ten.vercel.app` y permitir `https://thrive-platform-ten.vercel.app/trayectorias` como URL de retorno. Verificar Email OTP y la configuración del proveedor de correo. Nunca compartir credenciales en GitHub.
4. Comprobar creación de sesión, ruta, pasos, avances e intentos con dos cuentas distintas: ningún usuario puede consultar o editar datos ajenos. Comprobar que anon no pueda consultar ninguna tabla de alumno.
5. Comprobar que una sesión expirada no borre avances guardados y que la app comunique fallos de sincronización.

## Privacidad y precisión
- Solo `auth.uid()` puede acceder a rutas, pasos e intentos propios; no hay políticas para anónimos.
- Cada respuesta de ejercicio se almacena como **autoevaluación de borrador**; no es nota oficial ni validación pedagógica.
- No se guarda información sensible sobre psicometría, religión o salud.
- El algoritmo combina meta y conocimientos autodeclarados; no infiere inteligencias fijas ni capacidades permanentes.
- Las aplicaciones son hipótesis hasta ser revisadas con evidencia.

## Siguientes mejoras
- Pruebas automatizadas de topología del grafo, ciclos y rutas incompletas.
- Evaluación educativa validada y explicaciones de errores con revisión humana.
- Recomendaciones basadas en repaso espaciado y desempeño verificado, bajo consentimiento.
- Revisión docente, publicación editorial, fuentes y accesibilidad.
