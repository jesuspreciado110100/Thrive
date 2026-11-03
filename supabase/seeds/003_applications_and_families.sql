-- Interdisciplinary connections and candidate applications. Hypotheses, not validated inventions or accredited curricula.
insert into public.emergent_applications(slug,name,challenge,hypothesis,evidence_status) values
('gemelos_infraestructura','Gemelos digitales para infraestructura resiliente','¿Cómo anticipar fallas y orientar mantenimiento de infraestructura urbana?','Integrar sensores, modelos físicos y planeación urbana podría ayudar a comparar escenarios de riesgo antes de intervenir.','hypothesis'),
('agricultura_hidrica','Agricultura de precisión y gestión hídrica','¿Cómo reducir el desperdicio de agua manteniendo productividad y salud del suelo?','Cruzar mediciones de suelo, observaciones remotas, modelos estadísticos y conocimiento ecológico podría apoyar mejores decisiones de riego.','hypothesis'),
('educacion_adaptativa','Aprendizaje adaptativo con supervisión humana','¿Cómo personalizar contenidos sin reducir a los estudiantes a etiquetas fijas?','Combinar ciencias del aprendizaje, diseño centrado en personas y modelos de IA con supervisión docente podría recomendar rutas ajustables.','hypothesis'),
('rehabilitacion_asistida','Robótica asistiva para rehabilitación','¿Cómo adaptar ayudas motrices a distintas necesidades y condiciones clínicas?','Articular rehabilitación clínica, robótica, sensores y co-diseño podría generar dispositivos de asistencia evaluables con pacientes.','hypothesis'),
('genomica_responsable','Investigación genómica computacional responsable','¿Cómo analizar datos genéticos cuidando calidad, consentimiento y sesgos?','Vincular genética, bioinformática, estadística y gobernanza podría favorecer herramientas de investigación transparentes.','hypothesis'),
('ciudades_calor','Planeación urbana frente a calor extremo','¿Cómo identificar zonas vulnerables y evaluar intervenciones urbanas?','Combinar teledetección, ecología, modelos y participación urbana podría orientar infraestructura verde.','hypothesis'),
('auditoria_vision','Auditoría de sistemas de visión artificial','¿Cómo detectar errores y sesgos al usar modelos que interpretan imágenes?','Cruzar evaluación estadística, visión artificial y gobernanza ayudaría a diseñar pruebas y controles de uso.','hypothesis'),
('materiales_circulares','Diseño circular de productos y materiales','¿Cómo reducir impacto ambiental sin perder funcionalidad y seguridad?','Integrar propiedades de materiales, sostenibilidad, diseño humano y simulación podría producir soluciones evaluables.','hypothesis')
on conflict(slug) do nothing;
with candidates(app_slug,concept_slug,contribution,rationale) as (values ('gemelos_infraestructura','gemelos_digitales','core','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('gemelos_infraestructura','sensores','core','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('gemelos_infraestructura','simulacion','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('gemelos_infraestructura','planeacion_urbana','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('gemelos_infraestructura','sostenibilidad','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('agricultura_hidrica','suelo_agua','core','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('agricultura_hidrica','teledeteccion','core','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('agricultura_hidrica','ecosistemas','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('agricultura_hidrica','aprendizaje_automatico','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('agricultura_hidrica','sostenibilidad','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('educacion_adaptativa','aprendizaje_humano','core','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('educacion_adaptativa','interaccion_humano_computadora','core','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('educacion_adaptativa','aprendizaje_automatico','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('educacion_adaptativa','gobernanza_ia','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('educacion_adaptativa','etica','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('rehabilitacion_asistida','rehabilitacion','core','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('rehabilitacion_asistida','robotica','core','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('rehabilitacion_asistida','sensores','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('rehabilitacion_asistida','diseno_humano','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('rehabilitacion_asistida','etica','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('genomica_responsable','genetica','core','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('genomica_responsable','bioinformatica','core','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('genomica_responsable','estadistica','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('genomica_responsable','gobernanza_ia','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('genomica_responsable','etica','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('ciudades_calor','planeacion_urbana','core','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('ciudades_calor','teledeteccion','core','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('ciudades_calor','ecosistemas','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('ciudades_calor','modelado','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('ciudades_calor','sostenibilidad','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('auditoria_vision','vision_artificial','core','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('auditoria_vision','estadistica','core','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('auditoria_vision','gobernanza_ia','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('auditoria_vision','etica','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('materiales_circulares','materiales','core','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('materiales_circulares','sostenibilidad','core','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('materiales_circulares','diseno_humano','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'),
('materiales_circulares','simulacion','enabler','Área de conocimiento que puede aportar métodos o restricciones al prototipo.'))
insert into public.application_concepts(application_id,concept_id,contribution,rationale)
select a.id,c.id,p.contribution,p.rationale from candidates p
join public.emergent_applications a on a.slug=p.app_slug
join public.knowledge_concepts c on c.slug=p.concept_slug
on conflict(application_id,concept_id) do nothing;
with proposals(family_name,concept_slug,role) as (values ('Inteligencia artificial y datos','aprendizaje_automatico','foundation'),
('Inteligencia artificial y datos','estadistica','foundation'),
('Inteligencia artificial y datos','datos','relevant'),
('Inteligencia artificial y datos','vision_artificial','relevant'),
('Inteligencia artificial y datos','gobernanza_ia','relevant'),
('Computación e informática','logica','foundation'),
('Computación e informática','algoritmos','foundation'),
('Computación e informática','programacion','relevant'),
('Computación e informática','bases_datos','relevant'),
('Matemáticas y física','matematicas','foundation'),
('Matemáticas y física','probabilidad','foundation'),
('Matemáticas y física','algebra_lineal','relevant'),
('Matemáticas y física','modelado','relevant'),
('Matemáticas y física','materia','relevant'),
('Matemáticas y física','fuerzas_movimiento','relevant'),
('Biología y biotecnología','vida','foundation'),
('Biología y biotecnología','biologia_celular','foundation'),
('Biología y biotecnología','genetica','relevant'),
('Biología y biotecnología','bioinformatica','relevant'),
('Ingeniería civil','fuerzas_movimiento','foundation'),
('Ingeniería civil','materiales','foundation'),
('Ingeniería civil','estructuras','relevant'),
('Ingeniería civil','simulacion','relevant'),
('Ingeniería civil','gemelos_digitales','relevant'),
('Arquitectura y urbanismo','planeacion_urbana','foundation'),
('Arquitectura y urbanismo','gemelos_digitales','foundation'),
('Arquitectura y urbanismo','sostenibilidad','relevant'),
('Agronomía y agroindustria','suelo_agua','foundation'),
('Agronomía y agroindustria','sensores','foundation'),
('Agronomía y agroindustria','teledeteccion','relevant'),
('Ciencias ambientales','ecosistemas','foundation'),
('Ciencias ambientales','suelo_agua','foundation'),
('Ciencias ambientales','sostenibilidad','relevant'),
('Diseño industrial','necesidades','foundation'),
('Diseño industrial','investigacion_usuarios','foundation'),
('Diseño industrial','diseno_humano','relevant'),
('Diseño industrial','materiales','relevant'),
('Psicología','necesidades','foundation'),
('Psicología','investigacion_usuarios','foundation'),
('Psicología','aprendizaje_humano','relevant'),
('Medicina y salud','neurociencia','foundation'),
('Medicina y salud','rehabilitacion','foundation'),
('Medicina y salud','etica','relevant'),
('Robótica y automatización','sensores','foundation'),
('Robótica y automatización','robotica','foundation'),
('Robótica y automatización','programacion','relevant'),
('Educación y pedagogía','aprendizaje_humano','foundation'),
('Educación y pedagogía','diseno_humano','foundation'),
('Educación y pedagogía','etica','relevant'),
('Derecho y gobierno','etica','foundation'),
('Derecho y gobierno','gobernanza_ia','foundation'),
('Geología y geociencias','suelo_agua','foundation'),
('Geología y geociencias','materia','foundation'),
('Electrónica y telecomunicaciones','sensores','foundation'),
('Electrónica y telecomunicaciones','materia','foundation'),
('Diseño gráfico y visual','diseno_humano','foundation'),
('Diseño gráfico y visual','investigacion_usuarios','foundation'),
('Neurociencias','neurociencia','foundation'),
('Neurociencias','rehabilitacion','foundation'),
('Sociología y antropología','investigacion_usuarios','foundation'),
('Sociología y antropología','sistemas','foundation'),
('Sociología y antropología','etica','relevant'))
insert into public.family_concepts(family_id,concept_id,role,review_status)
select f.id,c.id,p.role,'proposed' from proposals p
join public.knowledge_families f on f.name=p.family_name
join public.knowledge_concepts c on c.slug=p.concept_slug
on conflict(family_id,concept_id) do nothing;
insert into public.knowledge_nodes(entity_type,entity_id,label,metadata)
select 'application',id,name,jsonb_build_object('challenge',challenge,'hypothesis',hypothesis,'evidence_status',evidence_status)
from public.emergent_applications on conflict(entity_type,entity_id) do nothing;
insert into public.knowledge_edges(source_node_id,target_node_id,relation_type,weight,metadata)
select cn.id,an.id,'contributes_to',0.5,jsonb_build_object('validation_status',a.evidence_status,'contribution',ac.contribution,'rationale',ac.rationale)
from public.application_concepts ac
join public.emergent_applications a on a.id=ac.application_id
join public.knowledge_nodes cn on cn.entity_type='concept' and cn.entity_id=ac.concept_id
join public.knowledge_nodes an on an.entity_type='application' and an.entity_id=ac.application_id
on conflict(source_node_id,target_node_id,relation_type) do nothing;
insert into public.knowledge_edges(source_node_id,target_node_id,relation_type,weight,metadata)
select fn.id,cn.id,'introduces',0.6,jsonb_build_object('validation_status',fc.review_status,'role',fc.role)
from public.family_concepts fc
join public.knowledge_nodes fn on fn.entity_type='family' and fn.entity_id=fc.family_id
join public.knowledge_nodes cn on cn.entity_type='concept' and cn.entity_id=fc.concept_id
on conflict(source_node_id,target_node_id,relation_type) do nothing;