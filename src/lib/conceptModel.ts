import { getSupabaseClient } from './supabase';

export type Concept = {
  id: string; slug: string; name: string; summary: string; depth: number;
  domain: string; editorial_status: string;
};
export type ConceptRelation = {
  id: string; source_concept_id: string; target_concept_id: string;
  relation_type: 'prerequisite_for' | 'complements' | 'applies_to';
  explanation: string; validation_status: string;
};
export type Application = {
  id: string; slug: string; name: string; challenge: string;
  hypothesis: string; evidence_status: string;
};
export type ApplicationConcept = { application_id: string; concept_id: string; contribution: string; rationale: string };
export type FamilyConcept = { family_id: string; concept_id: string; role: string; review_status: string };
export type Family = { id: string; name: string };
export type ConceptModel = {
  concepts: Concept[]; relationships: ConceptRelation[]; applications: Application[];
  applicationConcepts: ApplicationConcept[]; familyConcepts: FamilyConcept[]; families: Family[];
};

export async function loadConceptModel(): Promise<ConceptModel> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Faltan variables públicas de conexión a Supabase.');
  const [concepts, relationships, applications, applicationConcepts, familyConcepts, families] = await Promise.all([
    client.from('knowledge_concepts').select('id,slug,name,summary,depth,domain,editorial_status').order('depth').order('name').limit(500),
    client.from('concept_relationships').select('id,source_concept_id,target_concept_id,relation_type,explanation,validation_status').limit(2000),
    client.from('emergent_applications').select('id,slug,name,challenge,hypothesis,evidence_status').order('name').limit(200),
    client.from('application_concepts').select('application_id,concept_id,contribution,rationale').limit(2000),
    client.from('family_concepts').select('family_id,concept_id,role,review_status').limit(2000),
    client.from('knowledge_families').select('id,name').limit(200)
  ]);
  for (const result of [concepts, relationships, applications, applicationConcepts, familyConcepts, families]) {
    if (result.error) throw new Error(result.error.message);
  }
  return {
    concepts: (concepts.data ?? []) as Concept[],
    relationships: (relationships.data ?? []) as ConceptRelation[],
    applications: (applications.data ?? []) as Application[],
    applicationConcepts: (applicationConcepts.data ?? []) as ApplicationConcept[],
    familyConcepts: (familyConcepts.data ?? []) as FamilyConcept[],
    families: (families.data ?? []) as Family[]
  };
}
