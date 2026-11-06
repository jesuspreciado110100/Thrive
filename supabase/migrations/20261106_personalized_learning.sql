-- Thrive | Personalized learning, private per user.
-- PENDING: apply to Supabase Thrive project xmigmkffybigjksonwpe after restoring connector permissions.
-- Uses only auth.uid() for ownership. Public concept graph stays read-only.

create table if not exists public.learner_paths (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (length(btrim(title)) between 1 and 180),
  goal_type text not null check (goal_type in ('concept', 'application')),
  goal_concept_id uuid references public.knowledge_concepts(id) on delete restrict,
  goal_application_id uuid references public.emergent_applications(id) on delete restrict,
  strategy_version text not null default 'graph-v1',
  status text not null default 'active' check (status in ('active','paused','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint learner_paths_valid_goal check (
    (goal_type='concept' and goal_concept_id is not null and goal_application_id is null) or
    (goal_type='application' and goal_application_id is not null and goal_concept_id is null)
  )
);
create index if not exists learner_paths_user_idx on public.learner_paths(user_id,updated_at desc);

create table if not exists public.learner_path_steps (
  id uuid primary key default gen_random_uuid(),
  path_id uuid not null references public.learner_paths(id) on delete cascade,
  concept_id uuid not null references public.knowledge_concepts(id) on delete restrict,
  position integer not null check(position between 0 and 199),
  reason text not null check (reason in ('foundation','goal','interdisciplinary')),
  status text not null default 'pending' check (status in ('pending','in_progress','completed','review')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(path_id,concept_id),
  unique(path_id,position),
  constraint completion_time_consistent check (
    (status='completed' and completed_at is not null)
    or (status<>'completed' and completed_at is null)
  )
);
create index if not exists learner_path_steps_path_idx on public.learner_path_steps(path_id,position);

-- Prototype practice events are explicitly SELF-REPORTED, never authoritative grades.
-- correct_option in bundled lesson drafts is public and can be inspected by any user.
create table if not exists public.learner_practice_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  path_step_id uuid not null references public.learner_path_steps(id) on delete cascade,
  lesson_slug text not null check (length(lesson_slug) between 1 and 120),
  selected_option smallint not null check(selected_option between 0 and 3),
  client_reported_correct boolean not null,
  evaluation_source text not null default 'draft_client' check (evaluation_source='draft_client'),
  attempted_at timestamptz not null default now()
);
create index if not exists learner_practice_attempts_user_idx on public.learner_practice_attempts(user_id,attempted_at desc);
create index if not exists learner_practice_attempts_step_idx on public.learner_practice_attempts(path_step_id,attempted_at desc);

alter table public.learner_paths enable row level security;
alter table public.learner_path_steps enable row level security;
alter table public.learner_practice_attempts enable row level security;

create policy "Learner read own paths" on public.learner_paths for select to authenticated
using (user_id=(select auth.uid()));
create policy "Learner insert own paths" on public.learner_paths for insert to authenticated
with check (user_id=(select auth.uid()));
create policy "Learner update own paths" on public.learner_paths for update to authenticated
using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create policy "Learner delete own paths" on public.learner_paths for delete to authenticated
using (user_id=(select auth.uid()));

create policy "Learner read own steps" on public.learner_path_steps for select to authenticated
using (exists (select 1 from public.learner_paths p where p.id=path_id and p.user_id=(select auth.uid())));
create policy "Learner insert own steps" on public.learner_path_steps for insert to authenticated
with check (exists (select 1 from public.learner_paths p where p.id=path_id and p.user_id=(select auth.uid())));
create policy "Learner update own steps" on public.learner_path_steps for update to authenticated
using (exists (select 1 from public.learner_paths p where p.id=path_id and p.user_id=(select auth.uid())))
with check (exists (select 1 from public.learner_paths p where p.id=path_id and p.user_id=(select auth.uid())));
create policy "Learner delete own steps" on public.learner_path_steps for delete to authenticated
using (exists (select 1 from public.learner_paths p where p.id=path_id and p.user_id=(select auth.uid())));

create policy "Learner read own practice" on public.learner_practice_attempts for select to authenticated
using (user_id=(select auth.uid()) and exists (
  select 1 from public.learner_path_steps s join public.learner_paths p on p.id=s.path_id
  where s.id=path_step_id and p.user_id=(select auth.uid())
));
create policy "Learner insert own practice" on public.learner_practice_attempts for insert to authenticated
with check (user_id=(select auth.uid()) and exists (
  select 1 from public.learner_path_steps s join public.learner_paths p on p.id=s.path_id
  where s.id=path_step_id and p.user_id=(select auth.uid())
));

-- Avoid granting write privileges to anonymous visitors.
revoke all on public.learner_paths,public.learner_path_steps,public.learner_practice_attempts from anon;
grant select,insert,update,delete on public.learner_paths,public.learner_path_steps to authenticated;
grant select,insert on public.learner_practice_attempts to authenticated;

comment on table public.learner_paths is 'Personalized learning paths; RLS owner-scoped and never part of public knowledge graph.';
comment on table public.learner_practice_attempts is 'Unverified client-reported answers for draft lessons; not official grades or certification.';
