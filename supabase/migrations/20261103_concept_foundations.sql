-- Thrive knowledge progression schema. Applied to Supabase Thrive on 2026-11-03.
create table if not exists public.knowledge_concepts(
 id uuid primary key default gen_random_uuid(), slug text not null unique,
 name text not null, summary text not null,
 depth smallint not null check(depth between 0 and 4),
 domain text not null,
 editorial_status text not null default 'draft' check(editorial_status in ('draft','reviewed','published')),
 created_at timestamptz not null default now()
);
create table if not exists public.concept_relationships(
 id uuid primary key default gen_random_uuid(),
 source_concept_id uuid not null references public.knowledge_concepts(id) on delete cascade,
 target_concept_id uuid not null references public.knowledge_concepts(id) on delete cascade,
 relation_type text not null check(relation_type in ('prerequisite_for','complements','applies_to')),
 explanation text not null,
 validation_status text not null default 'proposed' check(validation_status in ('proposed','reviewed','validated')),
 created_at timestamptz not null default now(),
 check(source_concept_id<>target_concept_id),
 unique(source_concept_id,target_concept_id,relation_type)
);
create table if not exists public.family_concepts(
 family_id uuid not null references public.knowledge_families(id) on delete cascade,
 concept_id uuid not null references public.knowledge_concepts(id) on delete cascade,
 role text not null default 'relevant' check(role in ('foundation','specialization','relevant')),
 review_status text not null default 'proposed' check(review_status in ('proposed','reviewed','validated')),
 primary key(family_id,concept_id)
);
create table if not exists public.emergent_applications(
 id uuid primary key default gen_random_uuid(),
 slug text not null unique, name text not null,
 challenge text not null, hypothesis text not null,
 evidence_status text not null default 'hypothesis' check(evidence_status in ('hypothesis','under_review','evidence_supported')),
 created_at timestamptz not null default now()
);
create table if not exists public.application_concepts(
 application_id uuid not null references public.emergent_applications(id) on delete cascade,
 concept_id uuid not null references public.knowledge_concepts(id) on delete cascade,
 contribution text not null default 'contributing' check(contribution in ('core','enabler','contributing')),
 rationale text not null,
 primary key(application_id,concept_id)
);
alter table public.knowledge_nodes drop constraint if exists knowledge_nodes_entity_type_check;
alter table public.knowledge_nodes add constraint knowledge_nodes_entity_type_check
 check(entity_type in ('division','family','program','competency','lab','agent','industry','concept','application'));
create index if not exists knowledge_concepts_depth_idx on public.knowledge_concepts(depth);
create index if not exists concept_relationships_target_idx on public.concept_relationships(target_concept_id);
create index if not exists family_concepts_concept_idx on public.family_concepts(concept_id);
create index if not exists application_concepts_concept_idx on public.application_concepts(concept_id);
alter table public.knowledge_concepts enable row level security;
alter table public.concept_relationships enable row level security;
alter table public.family_concepts enable row level security;
alter table public.emergent_applications enable row level security;
alter table public.application_concepts enable row level security;
create policy "Read concepts" on public.knowledge_concepts for select to anon,authenticated using(true);
create policy "Read concept relationships" on public.concept_relationships for select to anon,authenticated using(true);
create policy "Read family concepts" on public.family_concepts for select to anon,authenticated using(true);
create policy "Read candidate applications" on public.emergent_applications for select to anon,authenticated using(true);
create policy "Read application concepts" on public.application_concepts for select to anon,authenticated using(true);
