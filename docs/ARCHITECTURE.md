# Arquitectura Thrive

- Aplicación: Next.js App Router + TypeScript.
- Datos: Supabase Thrive (`xmigmkffybigjksonwpe`), independiente de BuildIt.
- Universo 3D futuro: React Three Fiber / Three.js.
- Autenticación futura: Supabase Auth y políticas RLS específicas.
- La base actual tiene 471 denominaciones de programas sin clasificación validada; no presentarlas como 471 grados acreditados.
- Seguridad: únicamente clave publicable en cliente; jamás service_role ni secretos en Git.

## Próximos pasos

1. Definir políticas de lectura RLS para catálogo público, manteniendo privadas las tablas de agentes y usuarios.
2. Clasificar programas por familia y registrar procedencia completa.
3. Implementar API de grafo y visualizador 3D.
4. Incorporar autenticación, perfiles, roles y aprendizaje.
