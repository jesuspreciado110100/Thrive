'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadConceptModel, type ConceptModel } from '@/lib/conceptModel';

export default function FamilyBridgeExplorer() {
  const [model,setModel] = useState<ConceptModel|null>(null);
  const [error,setError] = useState('');
  const [familyA,setFamilyA] = useState('');
  const [familyB,setFamilyB] = useState('');

  useEffect(()=>{
    let active = true;
    loadConceptModel().then(m=>{
      if (!active) return;
      setModel(m);
      setFamilyA(m.families.find(f=>f.name==='Inteligencia artificial y datos')?.id ?? m.familyConcepts[0]?.family_id ?? '');
      setFamilyB(m.families.find(f=>f.name==='Biología y biotecnología')?.id ?? m.familyConcepts[1]?.family_id ?? '');
    }).catch(e=>{if(active)setError(String(e.message??e));});
    return ()=>{active=false;};
  },[]);

  const byConcept = useMemo(()=>new Map((model?.concepts??[]).map(c=>[c.id,c])),[model]);
  const assigned = useMemo(()=>new Set((model?.familyConcepts??[]).map(fc=>fc.family_id)),[model]);
  const options = useMemo(()=>(model?.families??[]).filter(f=>assigned.has(f.id)).sort((a,b)=>a.name.localeCompare(b.name,'es')),[model,assigned]);
  const membersA = useMemo(()=>new Set((model?.familyConcepts??[]).filter(fc=>fc.family_id===familyA).map(fc=>fc.concept_id)),[model,familyA]);
  const membersB = useMemo(()=>new Set((model?.familyConcepts??[]).filter(fc=>fc.family_id===familyB).map(fc=>fc.concept_id)),[model,familyB]);
  const shared = [...membersA].filter(id=>membersB.has(id)).map(id=>byConcept.get(id)).filter((c):c is NonNullable<typeof c>=>Boolean(c)).sort((a,b)=>a.depth-b.depth);
  const bridges = (model?.relationships??[]).filter(r=>
    (membersA.has(r.source_concept_id)&&membersB.has(r.target_concept_id))||
    (membersB.has(r.source_concept_id)&&membersA.has(r.target_concept_id)));
  const ideas = (model?.applications??[]).filter(a=>{
    const ids=(model?.applicationConcepts??[]).filter(ac=>ac.application_id===a.id).map(ac=>ac.concept_id);
    return ids.some(id=>membersA.has(id))&&ids.some(id=>membersB.has(id));
  });
  const left = model?.families.find(f=>f.id===familyA)?.name;
  const right = model?.families.find(f=>f.id===familyB)?.name;

  return <div className="bridge-explorer">
    {error && <p role="alert" className="concept-error">No se pudieron leer los vínculos desde Supabase: {error}</p>}
    {!model && !error && <p>Cargando familias y conexiones…</p>}
    {model && <>
      <div className="bridge-selector">
        <label>Primera disciplina
          <select value={familyA} onChange={e=>setFamilyA(e.target.value)}>
            {options.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </label>
        <span aria-hidden="true">×</span>
        <label>Segunda disciplina
          <select value={familyB} onChange={e=>setFamilyB(e.target.value)}>
            {options.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </label>
      </div>
      {familyA===familyB?<p>Elige dos familias distintas para explorar sus intersecciones.</p>:<section>
        <h2>{left} + {right}</h2>
        <p>Este mapa utiliza asociaciones temáticas propuestas, todavía pendientes de revisión académica. No mide originalidad ni demuestra viabilidad.</p>
        <div className="bridge-stats">
          <div><strong>{shared.length}</strong><span>Conceptos compartidos</span></div>
          <div><strong>{bridges.length}</strong><span>Relaciones entre conceptos</span></div>
          <div><strong>{ideas.length}</strong><span>Hipótesis relacionadas</span></div>
        </div>
        <div className="bridge-panels">
          <section><h3>Base en común</h3>
            {shared.length?shared.map(c=><div className="bridge-finding" key={c.id}><strong>{c.name}</strong><small>Nivel {c.depth} · {c.summary}</small></div>):<p>Sin conceptos idénticos asignados. Esto no significa que ambas disciplinas no tengan relación.</p>}
          </section>
          <section><h3>Puentes entre temas</h3>
            {bridges.length?bridges.map(r=><div className="bridge-finding" key={r.id}><strong>{byConcept.get(r.source_concept_id)?.name} ↔ {byConcept.get(r.target_concept_id)?.name}</strong><small>{r.explanation}</small><small>Estado: {r.validation_status==='proposed'?'propuesto':r.validation_status}</small></div>):<p>Aún no hay una relación directa registrada entre sus conceptos.</p>}
          </section>
        </div>
        <h3>Aplicaciones que podrían explorar ambas áreas</h3>
        <div className="bridge-ideas">{ideas.length?ideas.map(a=><article key={a.id} className="bridge-idea">
          <strong>{a.name}</strong><p>{a.challenge}</p><small>Hipótesis: {a.hypothesis}</small>
        </article>):<p>Sin hipótesis que combinen estas dos familias en el catálogo actual. Podemos investigar retos antes de proponer una.</p>}</div>
        <p className="concept-disclaimer">Resultados derivados de un catálogo inicial y propuestas editoriales. La evidencia científica, los alcances y la novedad deben comprobarse por separado.</p>
        <p><a href="/fundamentos">Explorar los fundamentos →</a> · <a href="/universe">Ver universo 3D →</a></p>
      </section>}
    </>}
  </div>;
}
