-- Thrive public academic catalog (read-only for browser clients).
-- Applied to Supabase project xmigmkffybigjksonwpe.
-- Do not grant write access to anon/authenticated here.
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='academic_divisions' AND policyname='Public read academic divisions') THEN
 CREATE POLICY "Public read academic divisions" ON public.academic_divisions FOR SELECT TO anon, authenticated USING (true);
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='knowledge_families' AND policyname='Public read knowledge families') THEN
 CREATE POLICY "Public read knowledge families" ON public.knowledge_families FOR SELECT TO anon, authenticated USING (true);
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='academic_programs' AND policyname='Public read proposed program catalog') THEN
 CREATE POLICY "Public read proposed program catalog" ON public.academic_programs FOR SELECT TO anon, authenticated USING (true);
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='knowledge_nodes' AND policyname='Public read knowledge nodes') THEN
 CREATE POLICY "Public read knowledge nodes" ON public.knowledge_nodes FOR SELECT TO anon, authenticated USING (true);
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='knowledge_edges' AND policyname='Public read knowledge edges') THEN
 CREATE POLICY "Public read knowledge edges" ON public.knowledge_edges FOR SELECT TO anon, authenticated USING (true);
 END IF;
END $$;
