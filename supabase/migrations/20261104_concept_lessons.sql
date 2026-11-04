-- Pending migration: apply only after restoring permission to Thrive Supabase.
-- Draft learning units are private to administrative access until explicitly published.
create table if not exists public.concept_lessons (
  id uuid primary key default gen_random_uuid(),
  concept_id uuid not null references public.knowledge_concepts(id) on delete cascade,
  lesson_stage text not null default 'starter' check (lesson_stage in ('starter','deep_dive','application')),
  title text not null,
  explanation text not null,
  worked_example text not null,
  exercise_question text not null,
  exercise_options jsonb not null check (jsonb_typeof(exercise_options)='array' and jsonb_array_length(exercise_options)=4),
  correct_option smallint not null check (correct_option between 0 and 3),
  answer_explanation text not null,
  editorial_status text not null default 'draft' check (editorial_status in ('draft','reviewed','published')),
  source_status text not null default 'original_draft',
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (concept_id,lesson_stage)
);
create index if not exists concept_lessons_status_idx on public.concept_lessons(editorial_status);
alter table public.concept_lessons enable row level security;
create policy "Public read published concept lessons" on public.concept_lessons
 for select to anon, authenticated using (editorial_status='published');
-- No anon/authenticated INSERT, UPDATE or DELETE policy: admin only.
