'use client';
import { useMemo } from 'react';
import type { ConceptModel, Concept } from '@/lib/conceptModel';

const titles = ['Fundamentos','Principios','Métodos','Integración','Fronteras'];

export default function ApplicationPathway({ model, applicationId, onConcept }: {
  model: ConceptModel; applicationId: string; onConcept: (id: string) => void;
}) {
  const { stages, contributors } = useMemo(() => {
    const byId = new Map(model.concepts.map(c => [c.id, c]));
    const parents = new Map<string, string[]>();
    for (const r of model.relationships) {
      if (r.relation_type === 'prerequisite_for') {
        parents.set(r.target_concept_id, [...(parents.get(r.target_concept_id) ?? []), r.source_concept_id]);
      }
    }
    const inputs = model.applicationConcepts.filter(a => a.application_id === applicationId);
    const core = new Set(inputs.map(a => a.concept_id));
    const visited = new Set<string>();
    function climb(id: string) {
      if (visited.has(id)) return;
      visited.add(id);
      for (const parent of parents.get(id) ?? []) climb(parent);
    }
    for (const c of core) climb(c);
    const groups: Concept[][] = Array.from({length:5},()=>[]);
    for (const id of visited) {
      const c = byId.get(id);
      if (c && c.depth >= 0 && c.depth <= 4) groups[c.depth].push(c);
    }
    groups.forEach(arr => arr.sort((a,b)=>a.name.localeCompare(b.name,'es')));
    return { stages: groups, contributors: core };
  }, [model, applicationId]);
  return <section className="app-pathway" aria-label="Mapa de conocimientos hacia esta aplicación">
    <h4>Cómo llegar desde lo básico</h4>
    <p>Ruta de estudio orientativa que reúne los antecedentes propuestos de los conceptos implicados. Las ramas pueden estudiarse en paralelo.</p>
    <div className="app-pathway-grid">
      {stages.map((group,level)=><div key={level} className="app-pathway-stage">
        <small>Etapa {level} · {titles[level]}</small>
        {group.length ? group.map(c=><button key={c.id} type="button" onClick={()=>onConcept(c.id)} className={'app-pathway-chip' + (contributors.has(c.id) ? ' core' : '')}>
          {c.name}{contributors.has(c.id) ? ' •' : ''}</button>) : <span className="concept-empty">Sin antecedentes en esta etapa</span>}
      </div>)}
    </div>
    <p className="concept-disclaimer">• indica un concepto vinculado directamente con la hipótesis; los demás son antecedentes educativos propuestos.</p>
  </section>;
}
