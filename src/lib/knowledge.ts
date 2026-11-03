import { getSupabaseClient } from './supabase';
export type GraphNode={id:string;entity_type:string;entity_id:string;label:string;metadata?:Record<string,unknown>};
export type GraphEdge={id:string;source_node_id:string;target_node_id:string;relation_type:string;weight:number|null};
export async function loadKnowledgeGraph():Promise<{nodes:GraphNode[];edges:GraphEdge[]}>{
 const client=getSupabaseClient();
 if(!client) throw new Error('Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
 const [nodes,edges]=await Promise.all([
  client.from('knowledge_nodes').select('id,entity_type,entity_id,label,metadata').limit(2000),
  client.from('knowledge_edges').select('id,source_node_id,target_node_id,relation_type,weight').limit(5000)
 ]);
 if(nodes.error)throw new Error(nodes.error.message);
 if(edges.error)throw new Error(edges.error.message);
 return {nodes:nodes.data??[],edges:edges.data??[]};
}
