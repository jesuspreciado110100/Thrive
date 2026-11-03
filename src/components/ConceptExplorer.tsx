'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadConceptModel, type Concept, type ConceptModel } from '@/lib/conceptModel';

const levels = [
  { title: 'Fundamentos', subtitle: 'Observar, razonar, medir' },
  { title: 'Principios', subtitle: 'Lenguajes y procesos' },
  { title: 'Herramientas', subtitle: 'Métodos especializados' },
  { title: 'Integración', subtitle: 'Profundización disciplinaria' },
  { title: 'Fronteras', subtitle: 'Tecnologías y sistemas avanzados' }
];

function buildFoundationPath(model: ConceptModel, conceptId: string): Concept[] {
  const byId = new Map(model.concepts.map(c => [c.id, c]));
  const incoming = new Map<string, string[]>();
  for (const rel of model.relationships) {
    if (rel.relation_type !== 'prerequisite_for') continue;
    incoming.set(rel.target_concept_id, [...(incoming.get(rel.target_concept_id) ?? []), rel.source_concept_id]);
  }
  const visited = new Set<string>();
  function trace(id: string): Concept[] | null {
    const concept = byId.get(id);
    if (!concept || visited.has(id)) return null;
    visited.add(id);
    if (concept.depth === 0) return [concept];
    for (const source of incoming.get(id) ?? []) {
      const prior = trace(source);
      if (prior) return [...prior, concept];
    }
    return null;
  }
  return trace(conceptId) ?? (byId.has(conceptId) ? [byId.get(conceptId)!] : []);
}

export default function ConceptExplorer() {
  const [model, setModel] = useState<ConceptModel | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    loadConceptModel().then(result => {
      if (mounted) {
        setModel(result);
        setSelectedId(result.concepts.find(c => c.slug === 'aprendizaje_automatico')?.id ?? result.concepts[0]?.id ?? null);
      }
    }).catch(err => { if (mounted) setError(String(err.message ?? err)); });
    return () => { mounted = false; };
  }, []);

  const concepts = model?.concepts ?? [];
  const conceptMap = useMemo(() => new Map(concepts.map(c => [c.id, c])), [concepts]);
  const familyMap = useMemo(() => new Map((model?.families ?? []).map(f => [f.id, f.name])), [model]);
  const selected = selectedId ? conceptMap.get(selectedId) : undefined;
  const previous = (model?.relationships ?? []).filter(r => r.target_concept_id === selectedId && r.relation_type === 'prerequisite_for');
  const next = (model?.relationships ?? []).filter(r => r.source_concept_id === selectedId && r.relation_type === 'prerequisite_for');
  const related = (model?.relationships ?? []).filter(r => r.relation_type === 'complements' && (r.source_concept_id === selectedId || r.target_concept_id === selectedId));
  const attachedFamilies = (model?.familyConcepts ?? []).filter(r => r.concept_id === selectedId);
  const matchedApplications = (model?.applicationConcepts ?? []).filter(r => r.concept_id === selectedId);
  const chosenApp = model?.applications.find(a => a.id === applicationId);
  const appIngredients = (model?.applicationConcepts ?? []).filter(ac => ac.application_id === applicationId);
  const path = useMemo(() => selectedId && model ? buildFoundationPath(model, selectedId) : [], [selectedId, model]);
  const filtered = concepts.filter(c => (c.name + ' ' + c.summary + ' ' + c.domain).toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es')));

  function choose(id: string) {
    setSelectedId(id);
    setApplicationId(null);
  }

  return <div className="concept-explorer">
    <div className="concept-toolbar">
      <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar conceptos, métodos o ideas..." aria-label="Buscar conceptos" />
      <span>{concepts.length} conceptos · {model?.relationships.length ?? 0} relaciones · {model?.applications.length ?? 0} aplicaciones candidatas</span>
    </div>
    {error && <p role="alert" className="concept-error">No se pudo consultar Supabase: {error}</p>}
    {!model && !error && <p>Cargando mapa conceptual desde Supabase…</p>}
    {model && <>
      <section className="concept-depth-grid" aria-label="Niveles del conocimiento">
        {levels.map((level, index) => <div className="concept-depth" key={level.title}>
          <div className="concept-depth-head"><small>Nivel {index}</small><h2>{level.title}</h2><p>{level.subtitle}</p></div>
          <div className="concept-depth-items">
            {filtered.filter(c => c.depth === index).map(c => <button
              className={'concept-chip' + (selectedId === c.id ? ' selected' : '')}
              key={c.id} onClick={() => choose(c.id)} aria-pressed={selectedId === c.id}
              title={c.summary}>{c.name}</button>)}
            {!filtered.some(c => c.depth === index) && <span className="concept-empty">Sin coincidencias</span>}
          </div>
        </div>)}
      </section>
      {selected && <section className="concept-inspector">
        <div><small>Concepto · Nivel {selected.depth} · {selected.editorial_status === 'draft' ? 'borrador editorial' : selected.editorial_status}</small>
          <h2>{selected.name}</h2><p>{selected.summary}</p>
          <h3>Un camino desde los fundamentos</h3>
          <div className="concept-breadcrumb">{path.map((c, index) => <span key={c.id}><button onClick={() => choose(c.id)}>{c.name}</button>{index < path.length - 1 && <span aria-hidden="true"> → </span>}</span>)}</div>
          <div className="concept-relations">
            <div><h3>Antes: conocimientos de apoyo</h3>{previous.length ? previous.map(r => <button key={r.id} className="concept-neighbor" onClick={() => choose(r.source_concept_id)}>{conceptMap.get(r.source_concept_id)?.name}</button>) : <p>Este nodo es un punto de partida en el mapa.</p>}</div>
            <div><h3>Después: profundización</h3>{next.length ? next.map(r => <button key={r.id} className="concept-neighbor" onClick={() => choose(r.target_concept_id)}>{conceptMap.get(r.target_concept_id)?.name}</button>) : <p>No hay niveles posteriores registrados todavía.</p>}</div>
            <div><h3>Interconexiones</h3>{related.length ? related.map(r => {const other = r.source_concept_id === selectedId ? r.target_concept_id : r.source_concept_id; return <button title={r.explanation} key={r.id} className="concept-neighbor" onClick={() => choose(other)}>{conceptMap.get(other)?.name}</button>;}) : <p>Pendiente de investigar vínculos entre áreas.</p>}</div>
          </div>
          <h3>Familias donde puede utilizarse</h3>
          <div className="concept-tags">{attachedFamilies.length ? attachedFamilies.map(f => <span className="concept-tag" key={f.family_id} title={'Vínculo ' + f.review_status}>{familyMap.get(f.family_id) ?? 'Familia académica'}</span>) : <span className="concept-tag">Pendiente de clasificación</span>}</div>
          <p className="concept-disclaimer">Las rutas y asociaciones son propuestas educativas iniciales; no equivalen a planes de estudio acreditados ni a prerrequisitos universales.</p>
        </div>
        <aside><h3>¿Qué aplicaciones conecta?</h3>{matchedApplications.length ? matchedApplications.map(link => {const app = model.applications.find(a => a.id === link.application_id);return app ? <button key={app.id} className="concept-neighbor" onClick={() => setApplicationId(app.id)}>{app.name}</button> : null;}) : <p>Aún no hay aplicaciones registradas para este concepto.</p>}</aside>
      </section>}
      <section className="concept-applications">
        <div><small>Laboratorio de conexiones</small><h2>Aplicaciones posibles</h2><p>Ideas interdisciplinarias que surgen al combinar conceptos y abordar retos reales. Ninguna implica que se haya inventado una tecnología nueva.</p></div>
        <div className="concept-app-grid">{model.applications.map(a => <button key={a.id} className={'concept-app-card' + (applicationId === a.id ? ' selected' : '')} onClick={() => setApplicationId(a.id)}>
          <span>Hipótesis por explorar</span><strong>{a.name}</strong><small>{a.challenge}</small>
        </button>)}</div>
        {chosenApp && <article className="concept-app-detail"><small>Estado: {chosenApp.evidence_status === 'hypothesis' ? 'hipótesis sin validación' : chosenApp.evidence_status}</small>
          <h3>{chosenApp.name}</h3><p><strong>Problema:</strong> {chosenApp.challenge}</p><p><strong>Hipótesis:</strong> {chosenApp.hypothesis}</p>
          <h4>Conocimientos que podrían combinarse</h4><div className="concept-tags">{appIngredients.map(link => <button className="concept-neighbor" key={link.concept_id} onClick={() => choose(link.concept_id)}>{conceptMap.get(link.concept_id)?.name ?? 'Concepto'}</button>)}</div>
          <p className="concept-disclaimer">Para avanzar hace falta investigación documental, especialistas, evaluación de factibilidad y pruebas.</p>
        </article>}
      </section>
    </>}
  </div>;
}
