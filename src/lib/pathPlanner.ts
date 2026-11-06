import type { Concept, ConceptModel, ConceptRelation } from './conceptModel';

export type LearningGoal = { type: 'concept' | 'application'; id: string };
export type PlannedConcept = {
  conceptId: string;
  slug: string;
  name: string;
  summary: string;
  depth: number;
  domain: string;
  reason: 'foundation' | 'goal' | 'interdisciplinary';
  prerequisiteIds: string[];
};
export type LearningPlan = { title: string; steps: PlannedConcept[]; warnings: string[] };
export type CrossAreaLink = { conceptId: string; name: string; explanation: string; relatedTo: string };

function byName(a: Concept, b: Concept) {
  return a.name.localeCompare(b.name, 'es');
}

/** Deterministic, explainable path: recursive prerequisite closure + topological order.
 * It never labels a learner by a fixed intelligence type or claims a degree qualification.
 * All conceptual prerequisites remain editorial proposals until academically reviewed. */
export function buildLearningPlan(model: ConceptModel, goal: LearningGoal): LearningPlan {
  const concepts = new Map(model.concepts.map(c => [c.id, c]));
  const prereqs = new Map<string, ConceptRelation[]>();
  for (const r of model.relationships) {
    if (r.relation_type !== 'prerequisite_for') continue;
    prereqs.set(r.target_concept_id, [...(prereqs.get(r.target_concept_id) ?? []), r]);
  }
  const warnings: string[] = [];
  let title = '';
  let targets: string[] = [];
  if (goal.type === 'concept') {
    title = concepts.get(goal.id)?.name ?? 'Concepto no disponible';
    targets = concepts.has(goal.id) ? [goal.id] : [];
  } else {
    const app = model.applications.find(a => a.id === goal.id);
    title = app?.name ?? 'Aplicación no disponible';
    targets = model.applicationConcepts.filter(x => x.application_id === goal.id && concepts.has(x.concept_id)).map(x => x.concept_id);
  }
  targets = [...new Set(targets)].sort((a, b) => byName(concepts.get(a)!, concepts.get(b)!));
  const goals = new Set(targets);
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const ordered: string[] = [];
  function walk(id: string) {
    if (visited.has(id)) return;
    if (visiting.has(id)) {
      warnings.push('Se detectó un ciclo en una ruta propuesta; solicita revisión académica.');
      return;
    }
    if (!concepts.has(id)) return;
    visiting.add(id);
    const parents = (prereqs.get(id) ?? []).filter(r => concepts.has(r.source_concept_id))
      .sort((a, b) => byName(concepts.get(a.source_concept_id)!, concepts.get(b.source_concept_id)!));
    for (const r of parents) walk(r.source_concept_id);
    visiting.delete(id);
    visited.add(id);
    ordered.push(id);
  }
  for (const goalId of targets) walk(goalId);
  if (ordered.length > 180) warnings.push('La ruta supera el tamaño recomendado; conviene dividirla por objetivos.');
  const steps = ordered.slice(0, 180).map((id): PlannedConcept => {
    const c = concepts.get(id)!;
    return {
      conceptId: id, slug: c.slug, name: c.name, summary: c.summary,
      depth: c.depth, domain: c.domain,
      reason: goals.has(id) ? 'goal' : 'foundation',
      prerequisiteIds: [...new Set((prereqs.get(id) ?? []).map(r => r.source_concept_id))].filter(k => visited.has(k))
    };
  });
  if (steps.length === 0) warnings.push('No se encontraron conceptos para este objetivo.');
  return { title, steps, warnings };
}

/** Discover cross-discipline branches *outside* the student's current plan. */
export function suggestCrossAreaLinks(model: ConceptModel, stepIds: Iterable<string>, limit = 8): CrossAreaLink[] {
  const included = new Set(stepIds);
  const concepts = new Map(model.concepts.map(c => [c.id, c]));
  const output = new Map<string, CrossAreaLink>();
  for (const r of model.relationships) {
    if (r.relation_type !== 'complements') continue;
    const aIn = included.has(r.source_concept_id);
    const bIn = included.has(r.target_concept_id);
    if (aIn === bIn) continue;
    const outside = aIn ? r.target_concept_id : r.source_concept_id;
    const inside = aIn ? r.source_concept_id : r.target_concept_id;
    if (!concepts.has(outside) || !concepts.has(inside)) continue;
    output.set(outside, {conceptId: outside, name: concepts.get(outside)!.name,
      explanation: r.explanation, relatedTo: concepts.get(inside)!.name});
  }
  return [...output.values()].sort((a,b) => a.name.localeCompare(b.name, 'es')).slice(0,limit);
}

export function nextReadyStep(steps: PlannedConcept[], completed: ReadonlySet<string>): PlannedConcept | null {
  for (const s of steps) {
    if (completed.has(s.conceptId)) continue;
    if (s.prerequisiteIds.every(id => completed.has(id))) return s;
  }
  return steps.find(s => !completed.has(s.conceptId)) ?? null;
}
