'use client';

import { useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase';
import { loadConceptModel, type ConceptModel } from '@/lib/conceptModel';
import { lessonBySlug } from '@/lib/lessonDrafts';
import {
  buildLearningPlan, nextReadyStep, suggestCrossAreaLinks,
  type LearningGoal, type PlannedConcept
} from '@/lib/pathPlanner';

type SavedPath = {
  id: string; user_id: string; title: string; goal_type: LearningGoal['type'];
  goal_concept_id: string | null; goal_application_id: string | null;
  status: string; created_at: string;
};
type SavedStep = {
  id: string; path_id: string; concept_id: string; position: number;
  status: 'pending'|'in_progress'|'completed'|'review'; completed_at: string|null;
  reason: PlannedConcept['reason'];
};
type Attempt = { id: string; path_step_id: string; selected_option: number; client_reported_correct: boolean };

const stages = ['Fundamentos','Principios','Herramientas','Integración','Fronteras'];
const stepType: Record<string,string> = {foundation:'Base de la ruta',goal:'Parte del objetivo',interdisciplinary:'Conexión adicional'};

export default function PersonalizedLearning() {
  const [model,setModel] = useState<ConceptModel|null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [goalType,setGoalType] = useState<LearningGoal['type']>('application');
  const [goalId,setGoalId] = useState('');
  const [known,setKnown] = useState<Set<string>>(new Set());
  const [guestCompleted,setGuestCompleted] = useState<Set<string>>(new Set());
  const [focusId,setFocusId] = useState<string|null>(null);
  const [answerIndex,setAnswerIndex] = useState<number|null>(null);
  const [answerStatus,setAnswerStatus] = useState('');
  const [email,setEmail] = useState('');
  const [user,setUser] = useState<User|null>(null);
  const [authReady,setAuthReady] = useState(false);
  const [loginStatus,setLoginStatus] = useState('');
  const [paths,setPaths] = useState<SavedPath[]>([]);
  const [activeId,setActiveId] = useState<string|null>(null);
  const [savedSteps,setSavedSteps] = useState<SavedStep[]>([]);
  const [attempts,setAttempts] = useState<Attempt[]>([]);
  const [syncError,setSyncError] = useState('');
  const [working,setWorking] = useState(false);
  const client = useMemo(() => getSupabaseClient(), []);

  useEffect(() => {
    let mounted=true;
    loadConceptModel().then(m=>{
      if(!mounted)return;
      setModel(m);
      const app=m.applications.find(a=>a.slug==='educacion_adaptativa') ?? m.applications[0];
      if(app){setGoalType('application');setGoalId(app.id)}
      else if(m.concepts[0]){setGoalType('concept');setGoalId(m.concepts[0].id)}
    }).catch(e=>{if(mounted)setError(String(e.message??e))}).finally(()=>{if(mounted)setLoading(false)});
    return ()=>{mounted=false};
  }, []);

  useEffect(() => {
    if (!client) {setAuthReady(true);return}
    let mounted=true;
    client.auth.getUser().then(({data,error})=>{
      if(mounted){setUser(error?null:data.user);setAuthReady(true)}
    }).catch(()=>{if(mounted)setAuthReady(true)});
    const {data:{subscription}}=client.auth.onAuthStateChange((_event,session)=>{
      if(mounted){setUser(session?.user??null);setAuthReady(true)}
    });
    return ()=>{mounted=false;subscription.unsubscribe()};
  },[client]);

  useEffect(()=>{
    if(!client || !user){
      setPaths([]);setActiveId(null);setSavedSteps([]);setAttempts([]);setSyncError('');
      return;
    }
    let mounted=true;
    client.from('learner_paths')
      .select('id,user_id,title,goal_type,goal_concept_id,goal_application_id,status,created_at')
      .eq('user_id',user.id).order('created_at',{ascending:false}).limit(50)
      .then(({data,error})=>{
        if(!mounted)return;
        if(error) {setSyncError('El almacenamiento privado aún no está habilitado: '+error.message);return}
        setSyncError('');setPaths((data??[]) as SavedPath[]);
      });
    return ()=>{mounted=false};
  },[client,user?.id]);

  useEffect(()=>{
    const path=paths.find(p=>p.id===activeId);
    if(!client||!user||!path){setSavedSteps([]);setAttempts([]);return}
    let mounted=true;
    client.from('learner_path_steps').select('id,path_id,concept_id,position,status,completed_at,reason')
      .eq('path_id',path.id).order('position').limit(200).then(async ({data,error})=>{
        if(!mounted)return;
        if(error){setSyncError('No se pudieron leer los pasos: '+error.message);return}
        const steps=(data??[]) as SavedStep[];
        setSavedSteps(steps);
        const ids=steps.map(s=>s.id);
        if(ids.length===0){setAttempts([]);return}
        const result=await client.from('learner_practice_attempts')
          .select('id,path_step_id,selected_option,client_reported_correct')
          .in('path_step_id',ids).limit(2000);
        if(mounted){
          if(result.error)setSyncError('No se pudo leer el historial: '+result.error.message);
          else setAttempts((result.data??[]) as Attempt[]);
        }
      });
    return ()=>{mounted=false};
  },[client,user?.id,activeId,paths]);

  const activePath=paths.find(p=>p.id===activeId);
  const currentGoal:LearningGoal={
    type: activePath?.goal_type??goalType,
    id: activePath
      ? (activePath.goal_type==='concept'?activePath.goal_concept_id:activePath.goal_application_id)??''
      : goalId
  };
  const plan=useMemo(()=>model&&currentGoal.id?buildLearningPlan(model,currentGoal):null,[model,currentGoal.id,currentGoal.type]);
  const route=plan?.steps??[];
  const byId=useMemo(()=>new Map((model?.concepts??[]).map(c=>[c.id,c])),[model]);
  const stepIdMap=useMemo(()=>new Map(savedSteps.map(s=>[s.concept_id,s])),[savedSteps]);
  const done=useMemo(() => activePath
    ? new Set(savedSteps.filter(s=>s.status==='completed').map(s=>s.concept_id))
    : new Set([...known,...guestCompleted]),[activePath,savedSteps,known,guestCompleted]);
  const finished=route.filter(s=>done.has(s.conceptId)).length;
  const progress=route.length?Math.round(100*finished/route.length):0;
  const next=nextReadyStep(route,done);
  const focus=route.find(s=>s.conceptId===focusId)??next??route[0];
  const lesson=focus ? lessonBySlug[focus.slug]:undefined;
  const related=model?suggestCrossAreaLinks(model,route.map(s=>s.conceptId),8):[];
  const goalOptions=goalType==='concept'?model?.concepts??[]:model?.applications??[];

  function resetPreview(type:LearningGoal['type'],id:string) {
    setActiveId(null);setGoalType(type);setGoalId(id);
    setKnown(new Set());setGuestCompleted(new Set());
    setFocusId(null);setAnswerIndex(null);setAnswerStatus('');
  }

  function toggleKnown(id:string) {
    if(activePath)return;
    setKnown(prev=>{const n=new Set(prev);if(n.has(id))n.delete(id);else n.add(id);return n});
    setGuestCompleted(prev=>{const n=new Set(prev);n.delete(id);return n});
  }

  async function sendMagicLink(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(!client){setLoginStatus('Faltan las variables públicas de Supabase.');return}
    setLoginStatus('Enviando enlace…');
    const {error}=await client.auth.signInWithOtp({
      email:email.trim(), options:{emailRedirectTo:window.location.origin+'/trayectorias'}
    });
    setLoginStatus(error?'No fue posible enviar el enlace: '+error.message:'Revisa tu correo para iniciar sesión. El enlace debe estar permitido en Supabase Auth.');
  }

  async function savePath(){
    if(!client||!user||!plan||working)return;
    if(syncError){setLoginStatus('No se puede guardar todavía: la migración de seguimiento está pendiente.');return}
    if(plan.steps.length===0||plan.steps.length>180){setLoginStatus('La ruta requiere entre 1 y 180 conceptos.');return}
    setWorking(true);setLoginStatus('');
    const {data,pathError} = await (async()=>{
      const result=await client.from('learner_paths').insert({
        user_id:user.id,title:plan.title,goal_type:currentGoal.type,
        goal_concept_id:currentGoal.type==='concept'?currentGoal.id:null,
        goal_application_id:currentGoal.type==='application'?currentGoal.id:null,
        strategy_version:'graph-v1'
      }).select('id,user_id,title,goal_type,goal_concept_id,goal_application_id,status,created_at').single();
      return {data:result.data as SavedPath|null,pathError:result.error};
    })();
    if(pathError||!data){setLoginStatus('No se pudo crear la trayectoria: '+(pathError?.message??'Error desconocido'));setWorking(false);return}
    const now=new Date().toISOString();
    const {error:stepError}=await client.from('learner_path_steps').insert(plan.steps.map((s,index)=>({
      path_id:data.id,concept_id:s.conceptId,position:index,reason:s.reason,
      status:known.has(s.conceptId)||guestCompleted.has(s.conceptId)?'completed':'pending',
      completed_at:known.has(s.conceptId)||guestCompleted.has(s.conceptId)?now:null
    })));
    if(stepError){
      // Roll back the newly created path to avoid an empty partial itinerary.
      const rollback=await client.from('learner_paths').delete().eq('id',data.id);
      setLoginStatus('No se pudieron guardar los pasos: '+stepError.message+(rollback.error?' (y falló la limpieza de la ruta incompleta)':''));
      setWorking(false);return;
    }
    setPaths(prev=>[data,...prev]);
    setActiveId(data.id);
    setLoginStatus('Trayectoria guardada en tu cuenta.');
    setWorking(false);
  }

  async function toggleDone(conceptId:string){
    if(activePath && client && user){
      const saved=stepIdMap.get(conceptId);
      if(!saved||working)return;
      setWorking(true);
      const complete=saved.status!=='completed';
      const {data,error}=await client.from('learner_path_steps').update({
        status:complete?'completed':'pending',
        completed_at:complete?new Date().toISOString():null,
        updated_at:new Date().toISOString()
      }).eq('id',saved.id).select('id,path_id,concept_id,position,status,completed_at,reason').single();
      if(error){setSyncError('No se pudo guardar el cambio: '+error.message)}
      else if(data){setSavedSteps(prev=>prev.map(s=>s.id===saved.id?data as SavedStep:s))}
      setWorking(false);
    } else {
      setGuestCompleted(prev=>{const n=new Set(prev);if(n.has(conceptId))n.delete(conceptId);else n.add(conceptId);return n});
    }
  }

  async function practice(index:number){
    if(!focus||!lesson||answerIndex!==null)return;
    setAnswerIndex(index);setAnswerStatus('Respuesta orientativa, no calificación certificada.');
    const saved=stepIdMap.get(focus.conceptId);
    if(!client||!user||!activePath||!saved)return;
    const {data,error}=await client.from('learner_practice_attempts').insert({
      user_id:user.id,path_step_id:saved.id,lesson_slug:lesson.slug,
      selected_option:index,client_reported_correct:index===lesson.answer,
      evaluation_source:'draft_client'
    }).select('id,path_step_id,selected_option,client_reported_correct').single();
    if(error)setAnswerStatus('La respuesta se evaluó en pantalla pero NO se guardó: '+error.message);
    else if(data){setAttempts(prev=>[...prev,data as Attempt]);setAnswerStatus('Intento de práctica guardado (autoevaluación, no certificación).')}
  }

  function selectSaved(p:SavedPath){
    setActiveId(p.id);setGoalType(p.goal_type);
    setGoalId((p.goal_type==='concept'?p.goal_concept_id:p.goal_application_id)??'');
    setFocusId(null);setAnswerIndex(null);setAnswerStatus('');setLoginStatus('');
  }

  if(loading)return <div className="learning-shell"><p>Cargando conceptos y trayectorias desde Thrive…</p></div>;
  if(error||!model)return <div className="learning-shell" role="alert">No pudimos cargar el grafo de aprendizaje: {error}</div>;

  return <div className="learning-shell">
    <section className="learning-dashboard">
      <div><span className="learning-eyebrow">TU CAMINO · ADAPTABLE Y EXPLICABLE</span>
        <h2>Una meta. Distintas rutas para llegar.</h2>
        <p>Selecciona un objetivo, indica lo que ya conoces y avanza a tu ritmo. Los puentes entre áreas siguen disponibles durante todo el recorrido.</p>
      </div>
      <div className="learning-auth">
        <strong>{user?'Tu espacio privado':'Tu progreso, bajo tu control'}</strong>
        {user?<><p className="learning-note">{user.email??'Cuenta autenticada'} · acceso personal</p>
          <button onClick={()=>client?.auth.signOut()} type="button">Cerrar sesión</button></>
          :<form onSubmit={sendMagicLink}>
            <label htmlFor="learning-email">Correo electrónico</label>
            <input id="learning-email" required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com" />
            <button type="submit">Entrar con enlace por correo</button>
            <small>{authReady?'Puedes explorar sin iniciar sesión, pero el progreso será temporal.':'Comprobando sesión…'}</small>
          </form>}
        {loginStatus&&<p role="status" className="learning-note">{loginStatus}</p>}
      </div>
    </section>

    {user&&<section className="learning-saved">
      <h3>Mis trayectorias guardadas</h3>
      {syncError&&<p role="alert" className="learning-warning">{syncError} Puedes seguir probando rutas sin guardarlas.</p>}
      {paths.length===0?<p>Cuando esté disponible la base privada, podrás guardar aquí tus trayectorias.</p>:
        <div className="learning-saved-list">{paths.map(p=><button type="button" key={p.id} className={p.id===activeId?'active':''} onClick={()=>selectSaved(p)}>
          <strong>{p.title}</strong><small>{p.status==='active'?'En curso':p.status}</small>
        </button>)}</div>}
      {activePath&&<button type="button" className="learning-secondary" onClick={()=>resetPreview(goalType,goalId)}>Diseñar una nueva ruta</button>}
    </section>}

    {!activePath&&<section className="learning-goals">
      <div className="learning-goal-controls">
        <label>Quiero aprender para…
          <select value={goalType} onChange={e=>{
            const t=e.target.value as LearningGoal['type'];
            resetPreview(t,t==='concept'?model.concepts[0]?.id??'':model.applications[0]?.id??'');
          }}><option value="application">Resolver un reto interdisciplinario</option><option value="concept">Comprender un concepto</option></select>
        </label>
        <label>Mi objetivo específico
          <select value={goalId} onChange={e=>resetPreview(goalType,e.target.value)}>
            {goalOptions.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
      </div>
      <p className="learning-note">El sistema usa un mapa de prerrequisitos propuestos y lo adapta a los conocimientos que declares. No utiliza perfiles fijos ni hace diagnósticos.</p>
    </section>}

    <section className="learning-progress" aria-label="Avance de tu trayectoria">
      <div className="learning-progress-head">
        <div><span className="learning-eyebrow">{activePath?'TRAYECTORIA GUARDADA':'VISTA PREVIA SIN GUARDAR'}</span><h2>{plan?.title??'Selecciona una meta'}</h2></div>
        <strong>{progress}%</strong>
      </div>
      <div className="learning-progress-track"><div style={{width:progress+'%'}} /></div>
      <p>{finished} de {route.length} conceptos marcados como completados. {activePath?'Los avances se guardan solo si Supabase confirma cada cambio.':'Estas marcas se perderán si cierras o actualizas la pestaña.'}</p>
      {next&&<button className="learning-next" onClick={()=>{setFocusId(next.conceptId);setAnswerIndex(null);setAnswerStatus('')}} type="button">
        <span>Continuar aprendiendo</span><strong>{next.name}</strong><small>{next.summary}</small></button>}
      {plan?.warnings.map((w,i)=><p key={i} className="learning-warning">{w}</p>)}
      {!activePath&&<button className="learning-save" type="button" onClick={savePath} disabled={!user||Boolean(syncError)||working||route.length===0}>
        {working?'Guardando…':user?'Guardar trayectoria privada':'Inicia sesión para guardar tu avance'}</button>}
    </section>

    <div className="learning-two-column">
      <section className="learning-route">
        <h3>Tu mapa de aprendizaje</h3>
        <p>Los niveles son orientativos y no equivalen a semestres. Puedes explorar cualquier tema y marcar lo que ya dominas.</p>
        {stages.map((stage,stageNumber)=>{
          const group=route.filter(s=>s.depth===stageNumber);
          if(!group.length)return null;
          return <div key={stage} className="learning-stage">
            <h4><span>{stageNumber}</span>{stage}</h4>
            {group.map(s=>{
              const completed=done.has(s.conceptId);
              const selected=focus?.conceptId===s.conceptId;
              const dependencies=s.prerequisiteIds.filter(id=>!done.has(id));
              return <div className={'learning-step'+(selected?' selected':'')+(completed?' completed':'')} key={s.conceptId}>
                <button className="learning-step-info" type="button" onClick={()=>{setFocusId(s.conceptId);setAnswerIndex(null);setAnswerStatus('')}}>
                  <strong>{s.name}</strong><small>{stepType[s.reason]} · {s.domain}</small>
                  {dependencies.length>0&&!completed&&<small>{dependencies.length} bases sugeridas pendientes</small>}
                </button>
                <button className="learning-done" type="button" disabled={working||Boolean(activePath&&!stepIdMap.has(s.conceptId))}
                  aria-label={(completed?'Reabrir ':'Marcar completado ')+s.name}
                  aria-pressed={completed} onClick={()=>toggleDone(s.conceptId)}>
                  {completed?'✓':'○'}</button>
                {!activePath&&<button className="learning-prior" type="button" onClick={()=>toggleKnown(s.conceptId)}>
                  {known.has(s.conceptId)?'Ya lo sabía ✓':'Lo conozco'}</button>}
              </div>;
            })}
          </div>
        })}
      </section>

      <section className="learning-lesson" aria-live="polite">
        <span className="learning-eyebrow">APRENDE Y COMPRUEBA</span>
        {focus?<><h3>{focus.name}</h3><p>{focus.summary}</p>
          {lesson?<><h4>{lesson.title}</h4><p>{lesson.explanation}</p>
            <div className="learning-example"><strong>Ejemplo práctico</strong><p>{lesson.worked_example}</p></div>
            <h4>Prueba tu comprensión</h4><p>{lesson.question}</p>
            <div className="learning-answers">{lesson.options.map((opt,i)=><button key={i} type="button"
              disabled={answerIndex!==null}
              className={answerIndex!==null&&i===lesson.answer?'right':answerIndex===i?'wrong':''}
              onClick={()=>practice(i)}>{opt}</button>)}</div>
            {answerIndex!==null&&<div role="status" className="learning-feedback">
              <strong>{answerIndex===lesson.answer?'Respuesta adecuada':'Revisa esta idea'}</strong>
              <p>{lesson.feedback}</p><p>{answerStatus}</p>
              <button type="button" onClick={()=>{setAnswerIndex(null);setAnswerStatus('')}}>Practicar otra vez</button>
            </div>}</>:<div className="learning-placeholder">La microlección de este concepto todavía está por desarrollar. Puedes consultar su lugar en la ruta y explorar sus conexiones.</div>}
          {activePath&&stepIdMap.has(focus.conceptId)&&<p className="learning-note">
            Intentos de práctica registrados en este paso: {attempts.filter(a=>a.path_step_id===stepIdMap.get(focus.conceptId)?.id).length}
          </p>}
          <div className="learning-links"><a href="/fundamentos">Ver antecedentes y relaciones</a><a href="/puentes">Explorar intersecciones</a><a href="/universe">Ver en 3D</a></div>
        </>:<p>Elige una meta para comenzar.</p>}
        <p className="learning-note">Los ejercicios son borradores educativos y las respuestas no representan una certificación ni una evaluación oficial.</p>
      </section>
    </div>

    <section className="learning-bridges">
      <div><span className="learning-eyebrow">EXPLORA MÁS ALLÁ DE TU RUTA</span>
        <h2>Conexiones que abren otras posibilidades</h2>
        <p>Mientras profundizas en tu objetivo, Thrive muestra conceptos complementarios y caminos hacia otras disciplinas. Son vínculos propuestos que requieren revisión académica.</p></div>
      {related.length?<div className="learning-bridge-grid">{related.map(link=><article key={link.conceptId}>
        <small>Se conecta con: {link.relatedTo}</small><h3>{link.name}</h3><p>{link.explanation}</p>
        <button type="button" onClick={()=>resetPreview('concept',link.conceptId)}>Explorar este concepto</button>
      </article>)}</div>:<p>Este recorrido aún no tiene conexiones complementarias registradas.</p>}
      <a className="learning-bridge-link" href="/puentes">Comparar dos disciplinas en el explorador de puentes →</a>
    </section>
  </div>;
}
