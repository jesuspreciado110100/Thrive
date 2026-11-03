# Thrive: modelo de aprendizaje y descubrimiento interdisciplinario

## Propósito
El grafo no debe ser solo un directorio de carreras. Debe explicar:
1. Qué conceptos elementales permiten comprender una idea.
2. Cuáles son los siguientes niveles de profundización.
3. Dónde aparece el mismo concepto en distintas familias académicas.
4. Qué problemas reales podrían abordarse combinando conocimientos.
5. Cómo verificar las hipótesis antes de tratarlas como resultados.

## Estructura de la base
- `academic_divisions` → áreas generales.
- `knowledge_families` → familias de disciplinas.
- `academic_programs` → denominaciones de programas académicos, pendientes de depuración y clasificación.
- `knowledge_concepts` → conceptos con definición, nivel y dominio, independientes de las carreras.
- `concept_relationships` → rutas propuestas (`prerequisite_for`), complementariedad o aplicación.
- `family_concepts` → relevancia de un concepto para una familia; no infiere automáticamente acreditación ni equivalencia.
- `emergent_applications` → problemas e hipótesis de aplicación, aún sin validación.
- `application_concepts` → ingredientes conceptuales y su contribución a cada hipótesis.
- `knowledge_nodes` y `knowledge_edges` → proyección visual de esos datos.

## Niveles conceptuales
- Nivel 0: observación, medición, razonamiento, ética y otros fundamentos.
- Nivel 1: principios, representaciones, procesos.
- Nivel 2: técnicas y métodos específicos.
- Nivel 3: especialización e integración de métodos.
- Nivel 4: tecnologías y aplicaciones avanzadas.

No se asume que exista un único camino lineal: los vínculos pueden tener varios antecedentes, intersecciones y rutas alternativas. Los niveles no son equivalentes a semestres escolares.

## Proceso de aparición de una idea nueva
1. **Cruce:** identificar conceptos compartidos o complementarios entre al menos dos familias.
2. **Reto:** formular un problema claro y situado (no una combinación de palabras).
3. **Hipótesis:** explicar cómo la integración podría aportar valor y qué condiciones debería cumplir.
4. **Investigación previa:** comparar con literatura, patentes, práctica profesional, normas y productos existentes. No afirmar novedad sin evidencia.
5. **Revisión interdisciplinaria:** evaluación técnica, ética, ambiental y de especialistas.
6. **Experimento:** diseño de prueba, indicadores y datos; identificar fallas y límites.
7. **Resultado:** clasificar como descartado, mejorado, validado parcialmente o con evidencia suficiente; documentar fuentes.

## Criterios para conexiones
- `prerequisite_for`: ruta educativa propuesta, nunca requisito absoluto si no está respaldado.
- `complements`: relación interdisciplinaria explicada, no equivalencia.
- `introduces`: vínculo tentativo de familia → concepto, sujeto a revisión.
- `contributes_to`: un concepto que puede aportar a una hipótesis de aplicación.
- Relaciones marcadas `proposed` y aplicaciones `hypothesis` no deben mostrarse como conocimiento científico validado.

## Siguiente trabajo de datos
- Importar y completar procedencia de los 471 nombres de programas.
- Revisar pares en español e inglés sin eliminar las variantes originales.
- Clasificar carreras por familias con revisión humana.
- Enriquecer los conceptos con ejemplos, preguntas y recursos educativos confiables.
- Implementar búsqueda de puentes entre familias y evaluación humana de candidatos.
- Abrir flujos de aprendizaje personalizados sin asignar etiquetas fijas de capacidad a los estudiantes.

## Seguridad
Las tablas públicas de consulta no permiten edición anónima con las políticas RLS actuales. Los agentes y tareas internas permanecen protegidos. Nunca publicar claves de servicio de Supabase.
