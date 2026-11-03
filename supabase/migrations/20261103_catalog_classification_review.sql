-- Thrive: clasificación revisable y auditoría de catálogo.
create table if not exists public.program_classification_reviews (
 id uuid primary key default gen_random_uuid(),
 program_id uuid not null references public.academic_programs(id) on delete cascade,
 proposed_family_id uuid references public.knowledge_families(id),
 review_status text not null default 'pending' check (review_status in ('pending','reviewed','approved','rejected')),
 confidence numeric(4,3) check (confidence is null or (confidence between 0 and 1)),
 rationale text,
 reviewer_id uuid,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(program_id,proposed_family_id)
);
alter table public.program_classification_reviews enable row level security;
create index if not exists program_classification_reviews_status_idx on public.program_classification_reviews(review_status);
create index if not exists academic_programs_family_id_idx on public.academic_programs(family_id);
create index if not exists program_source_entries_program_id_idx on public.program_source_entries(program_id);
create or replace view public.academic_catalog_audit with (security_invoker=true) as
select p.id as program_id,p.name,p.status,p.family_id,f.name as family_name,
 count(s.id)::integer as source_entry_count,
 case when p.family_id is null then 'unclassified' else 'classified' end as classification_status
from public.academic_programs p
left join public.knowledge_families f on f.id=p.family_id
left join public.program_source_entries s on s.program_id=p.id
group by p.id,p.name,p.status,p.family_id,f.name;
grant select on public.academic_catalog_audit to authenticated;
revoke all on public.academic_catalog_audit from anon;
