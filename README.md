# Thrive Platform

Plataforma universitaria inteligente para recorrer conocimientos, disciplinas y aplicaciones interdisciplinarias.

**Aplicación en producción:** https://thrive-platform-ten.vercel.app  
**Explorador 3D:** https://thrive-platform-ten.vercel.app/universe  
**Fundamentos y conexiones:** https://thrive-platform-ten.vercel.app/fundamentos

## Primeros módulos

- `/`: inicio de la plataforma.
- `/universe`: grafo 3D de divisiones, familias, carreras, conceptos y aplicaciones.
- `/fundamentos`: conceptos desde los fundamentos hasta niveles avanzados, rutas y conexiones.
- `src/lib`: acceso público a Supabase y modelos académicos.
- `supabase/migrations`: esquema y controles de seguridad.
- `supabase/seeds`: conceptos y conexiones iniciales.
- `docs/KNOWLEDGE_MODEL.md`: reglas del modelo pedagógico y del descubrimiento interdisciplinario.

## Desarrollar

```bash
npm install
npm run dev
```

Crea un `.env.local` desde `.env.example` con la URL del proyecto Thrive en Supabase y su clave **publicable**; nunca utilices la `service_role` ni secretos en el frontend.

## Estado y límites

- Catálogo inicial de 471 denominaciones de carreras; **no son 471 grados acreditados y deduplicados**.
- 43 conceptos educativos de borrador, con rutas y conexiones propuestas.
- 8 aplicaciones interdisciplinarias etiquetadas como **hipótesis**, no inventos validados.
- Clasificación, procedencia, evidencias y revisión académica pendientes.
- Supabase Thrive es independiente de BuildIt.

Los usuarios públicos pueden consultar el catálogo, pero no modificarlo. Los datos privados requerirán autorización por rol antes de agregarse.
