'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { loadKnowledgeGraph, type GraphNode, type GraphEdge } from '@/lib/knowledge';
const colors:Record<string,string>={division:'#ffcb72',family:'#57e2d5',program:'#829bff',competency:'#f49bc1',lab:'#ff9877',agent:'#d3a6ff',industry:'#a5e48e'};
type Positioned=GraphNode&{pos:[number,number,number]};
function positions(nodes:GraphNode[],edges:GraphEdge[]):Positioned[]{
 const divisions=nodes.filter(n=>n.entity_type==='division').sort((a,b)=>a.label.localeCompare(b.label));
 const familyToDivision=new Map<string,string>();
 const byId=new Map(nodes.map(n=>[n.id,n]));
 for(const e of edges)if(e.relation_type==='contains'&&byId.get(e.source_node_id)?.entity_type==='division')familyToDivision.set(e.target_node_id,e.source_node_id);
 const divisionCenters=new Map(divisions.map((d,i)=>{const a=i*2*Math.PI/Math.max(1,divisions.length);return [d.id,[Math.cos(a)*16,0,Math.sin(a)*16] as [number,number,number]]}));
 const families=nodes.filter(n=>n.entity_type==='family').sort((a,b)=>a.label.localeCompare(b.label));
 const grouped=new Map<string,GraphNode[]>();
 for(const f of families){const d=familyToDivision.get(f.id)??'unknown';grouped.set(d,[...(grouped.get(d)??[]),f]);}
 const familyPos=new Map<string,[number,number,number]>();
 for(const [d,items] of grouped){const c=divisionCenters.get(d)??[0,0,0];items.forEach((f,i)=>{const a=i*2*Math.PI/items.length;familyPos.set(f.id,[c[0]+Math.cos(a)*7,Math.sin(a*2)*2,c[2]+Math.sin(a)*7]);});}
 const programs=nodes.filter(n=>n.entity_type==='program').sort((a,b)=>a.label.localeCompare(b.label));
 const programPos=new Map<string,[number,number,number]>();
 // Programs remain in an unclassified cloud until verified family assignments are loaded.
 programs.forEach((p,i)=>{const a=i*2.399963229728653;const r=10+Math.sqrt(i/programs.length)*13;programPos.set(p.id,[Math.cos(a)*r,12+(i%17)*0.37,Math.sin(a)*r]);});
 return nodes.map((n,i)=>({...n,pos:divisionCenters.get(n.id)??familyPos.get(n.id)??programPos.get(n.id)??[Math.sin(i)*20,0,Math.cos(i)*20]}));
}
function Scene({nodes,edges,selected,onSelect}:{nodes:Positioned[];edges:GraphEdge[];selected:string|null;onSelect:(id:string)=>void}){
 const byId=useMemo(()=>new Map(nodes.map(n=>[n.id,n])),[nodes]);
 const segments=useMemo(()=>edges.flatMap(e=>{const a=byId.get(e.source_node_id),b=byId.get(e.target_node_id);return a&&b?[...a.pos,...b.pos]:[];}),[edges,byId]);
 const geometry=useMemo(()=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(segments,3));return g},[segments]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <><ambientLight intensity={1.4}/><pointLight position={[15,20,15]} intensity={70}/><Stars radius={120} depth={60} count={1400} factor={3} fade/>
 <lineSegments geometry={geometry}><lineBasicMaterial color="#5d789d" transparent opacity={0.4}/></lineSegments>
 {nodes.map(n=><mesh key={n.id} position={n.pos} onClick={e=>{e.stopPropagation();onSelect(n.id)}} scale={selected===n.id?1.8:1}>
 <sphereGeometry args={[n.entity_type==='division'?0.85:n.entity_type==='family'?0.43:0.19,10,10]}/>
 <meshStandardMaterial color={colors[n.entity_type]??'#ffffff'} emissive={colors[n.entity_type]??'#ffffff'} emissiveIntensity={selected===n.id?0.9:0.3}/>
 {selected===n.id&&<Html distanceFactor={18} position={[0,1.1,0]} center><div className="node-label">{n.label}</div></Html>}
 </mesh>)}
 <OrbitControls enableDamping minDistance={8} maxDistance={95}/></>;
}
export default function KnowledgeUniverse(){
 const [nodes,setNodes]=useState<GraphNode[]>([]),[edges,setEdges]=useState<GraphEdge[]>([]);
 const [error,setError]=useState(''),[loading,setLoading]=useState(true),[selected,setSelected]=useState<string|null>(null),[filter,setFilter]=useState('all'),[search,setSearch]=useState('');
 useEffect(()=>{let active=true;loadKnowledgeGraph().then(g=>{if(active){setNodes(g.nodes);setEdges(g.edges)}}).catch(e=>{if(active)setError(String(e.message??e))}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
 const located=useMemo(()=>positions(nodes,edges),[nodes,edges]);
 const visible=useMemo(()=>located.filter(n=>(filter==='all'||n.entity_type===filter)&&(!search||n.label.toLocaleLowerCase().includes(search.toLocaleLowerCase()))),[located,filter,search]);
 const visibleIds=useMemo(()=>new Set(visible.map(n=>n.id)),[visible]);
 const visibleEdges=useMemo(()=>edges.filter(e=>visibleIds.has(e.source_node_id)&&visibleIds.has(e.target_node_id)),[edges,visibleIds]);
 const picked=nodes.find(n=>n.id===selected);
 return <div className="universe"><div className="universe-tools"><input aria-label="Buscar carrera o disciplina" placeholder="Buscar carrera o disciplina..." value={search} onChange={e=>setSearch(e.target.value)}/><select aria-label="Filtrar tipo" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">Todos los nodos</option><option value="division">Divisiones</option><option value="family">Familias</option><option value="program">Carreras</option></select><span>{visible.length} nodos · {visibleEdges.length} conexiones</span></div>
 {loading?<div className="universe-message">Cargando el universo desde Supabase…</div>:error?<div className="universe-message">No se pudo cargar el grafo: {error}</div>:<div className="universe-canvas"><Canvas camera={{position:[0,32,52],fov:60}}><Scene nodes={visible} edges={visibleEdges} selected={selected} onSelect={setSelected}/></Canvas></div>}
 <aside className="universe-details">{picked?<><small>{picked.entity_type}</small><h2>{picked.label}</h2><p>Identificador académico: {picked.entity_id}</p><button onClick={()=>setSelected(null)}>Cerrar selección</button></>:<><h2>Explora el conocimiento</h2><p>Arrastra para rotar, desplaza para acercar y selecciona un nodo para consultar su nombre.</p><p>Las carreras todavía no están asignadas a familias: aparecen en una nube independiente para no inventar relaciones.</p></>}</aside></div>;
}
