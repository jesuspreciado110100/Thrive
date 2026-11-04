/** First editorial draft; bundled so the demo stays usable while database sync is pending. */
export type LessonDraft = {slug:string;title:string;explanation:string;worked_example:string;question:string;options:string[];answer:number;feedback:string;status:'draft'};
export const lessonDrafts:LessonDraft[] = [
  {
    "slug": "observacion",
    "title": "Observar antes de explicar",
    "explanation": "Una observación registra lo que puede percibirse o medirse; una inferencia propone por qué ocurre.",
    "worked_example": "En una pared se ve una grieta de 2 mm. Eso es una observación; atribuirla al asentamiento del suelo es una hipótesis.",
    "question": "¿Cuál enunciado es una observación?",
    "options": [
      "La grieta mide aproximadamente 2 mm.",
      "El terreno se hundió.",
      "La obra fue mal diseñada.",
      "La pared fallará mañana."
    ],
    "answer": 0,
    "feedback": "La medida describe algo registrable; las otras opciones interpretan causas o anticipan resultados.",
    "status": "draft"
  },
  {
    "slug": "medicion",
    "title": "Medir con unidades y contexto",
    "explanation": "Una medición debe indicar magnitud, unidad, procedimiento y, cuando sea relevante, incertidumbre.",
    "worked_example": "Registrar 2.40 m de altura es más útil que escribir simplemente «2.40».",
    "question": "¿Cuál registro es más completo?",
    "options": [
      "Temperatura: 32 °C, sensor calibrado.",
      "Temperatura: alta.",
      "Temperatura: 32.",
      "Hace calor."
    ],
    "answer": 0,
    "feedback": "La magnitud, unidad e instrumento permiten interpretar y repetir la medición.",
    "status": "draft"
  },
  {
    "slug": "evidencia",
    "title": "Hipótesis y pruebas",
    "explanation": "Una afirmación necesita observaciones pertinentes y un método que reduzca explicaciones alternativas.",
    "worked_example": "Para evaluar un material se prueban muestras comparables bajo condiciones controladas.",
    "question": "¿Qué fortalece una conclusión experimental?",
    "options": [
      "Comparar condiciones y repetir mediciones.",
      "Confiar en una sola anécdota.",
      "Elegir solo resultados favorables.",
      "Evitar registrar condiciones."
    ],
    "answer": 0,
    "feedback": "La comparación y la repetición ayudan a identificar variación y causas alternativas.",
    "status": "draft"
  },
  {
    "slug": "sistemas",
    "title": "Entender sistemas conectados",
    "explanation": "En un sistema, modificar una parte puede afectar otras mediante dependencias y retroalimentación.",
    "worked_example": "En el suministro de agua, demanda, bombeo, energía y almacenamiento se influyen mutuamente.",
    "question": "¿Qué caracteriza al pensamiento sistémico?",
    "options": [
      "Analizar relaciones y efectos indirectos.",
      "Estudiar solo un componente aislado.",
      "Ignorar cambios de contexto.",
      "Suponer que todo efecto es inmediato."
    ],
    "answer": 0,
    "feedback": "La atención a las interacciones permite evaluar consecuencias no evidentes.",
    "status": "draft"
  },
  {
    "slug": "etica",
    "title": "Decisiones con consecuencias",
    "explanation": "La ética ayuda a examinar beneficios, daños, derechos, consentimiento y responsabilidades.",
    "worked_example": "Un tutor con IA debe proteger los datos del estudiante y permitir supervisión humana.",
    "question": "¿Qué práctica protege mejor a un estudiante?",
    "options": [
      "Recolectar lo mínimo necesario y explicar su uso.",
      "Vender su historial académico.",
      "Ocultar cómo se usa su información.",
      "Compartir contraseñas de acceso."
    ],
    "answer": 0,
    "feedback": "La minimización de datos y la transparencia reducen riesgos innecesarios.",
    "status": "draft"
  },
  {
    "slug": "matematicas",
    "title": "Relaciones y cantidades",
    "explanation": "Las matemáticas usan símbolos, números y estructuras para representar problemas con precisión.",
    "worked_example": "Si una pieza cuesta 40 pesos, cuatro piezas cuestan 160 pesos antes de descuentos o fletes.",
    "question": "¿Cuánto cuestan 3 piezas de 40 pesos cada una?",
    "options": [
      "120 pesos.",
      "43 pesos.",
      "160 pesos.",
      "12 pesos."
    ],
    "answer": 0,
    "feedback": "Tres veces cuarenta es 120; el cálculo supone precio constante.",
    "status": "draft"
  },
  {
    "slug": "logica",
    "title": "Construir argumentos válidos",
    "explanation": "La lógica distingue entre la estructura de un razonamiento y la veracidad de sus premisas.",
    "worked_example": "Si un sensor está desconectado, no transmite lecturas; se observa desconexión y se investiga el dato faltante.",
    "question": "¿Cuál ejemplo aplica una regla condicional?",
    "options": [
      "Si A implica B y ocurre A, entonces B.",
      "A implica B y ocurre B, por tanto A.",
      "Una conclusión se acepta por popularidad.",
      "Una observación elimina toda duda."
    ],
    "answer": 0,
    "feedback": "Es una aplicación de modus ponens, siempre que la premisa condicional sea válida.",
    "status": "draft"
  },
  {
    "slug": "materia",
    "title": "Materia, cambios y energía",
    "explanation": "La materia tiene propiedades medibles; la energía interviene en cambios físicos, químicos y térmicos.",
    "worked_example": "Un material puede expandirse al calentarse; su uso requiere considerar condiciones de temperatura.",
    "question": "¿Qué propiedad puede cambiar con temperatura?",
    "options": [
      "Longitud de una barra por expansión térmica.",
      "La identidad de su fabricante.",
      "Su número de inventario.",
      "El nombre comercial de la pieza."
    ],
    "answer": 0,
    "feedback": "La expansión térmica modifica dimensiones en numerosos materiales.",
    "status": "draft"
  },
  {
    "slug": "vida",
    "title": "Niveles de organización biológica",
    "explanation": "Los seres vivos se organizan desde estructuras celulares hasta organismos y ecosistemas.",
    "worked_example": "Las células forman tejidos y estos participan en la función de órganos.",
    "question": "¿Cuál estructura constituye la unidad básica de la vida?",
    "options": [
      "Célula.",
      "Planeta.",
      "Edificio.",
      "Circuito mecánico."
    ],
    "answer": 0,
    "feedback": "La célula es la unidad estructural y funcional básica de los seres vivos.",
    "status": "draft"
  },
  {
    "slug": "necesidades",
    "title": "Problemas humanos antes que soluciones",
    "explanation": "Una necesidad debe comprenderse en su contexto antes de proponer un producto o servicio.",
    "worked_example": "Antes de diseñar una aplicación educativa se observa cómo aprenden y qué barreras encuentran sus usuarios.",
    "question": "¿Qué conviene hacer antes de diseñar una solución?",
    "options": [
      "Investigar necesidades y restricciones reales.",
      "Elegir la tecnología más vistosa.",
      "Suponer que todos usan lo mismo.",
      "Ignorar diversidad de usuarios."
    ],
    "answer": 0,
    "feedback": "El contexto de uso evita resolver problemas equivocados.",
    "status": "draft"
  },
  {
    "slug": "datos",
    "title": "De observaciones a datos utilizables",
    "explanation": "Los datos adquieren sentido cuando conocemos sus variables, unidades, origen, calidad y limitaciones.",
    "worked_example": "Un registro de lluvia sin fecha ni ubicación impide comparar regiones o temporadas.",
    "question": "¿Cuál dato es más interpretable?",
    "options": [
      "12 mm de lluvia, estación X, 3 de junio.",
      "12 sin unidad.",
      "Un número sin procedencia.",
      "Mucha lluvia."
    ],
    "answer": 0,
    "feedback": "Unidad, fecha y procedencia permiten contextualizar el valor.",
    "status": "draft"
  },
  {
    "slug": "funciones",
    "title": "Cómo cambian dos variables",
    "explanation": "Una función relaciona entradas con salidas de manera definida dentro de un dominio.",
    "worked_example": "La distancia recorrida a velocidad constante puede expresarse como distancia = velocidad × tiempo.",
    "question": "A 5 km/h durante 2 h, la distancia idealizada es…",
    "options": [
      "10 km.",
      "2.5 km.",
      "7 km.",
      "25 km."
    ],
    "answer": 0,
    "feedback": "Distancia = 5 × 2 = 10 km, suponiendo velocidad constante.",
    "status": "draft"
  },
  {
    "slug": "probabilidad",
    "title": "Razonar bajo incertidumbre",
    "explanation": "La probabilidad cuantifica qué tan plausible es un resultado según supuestos y evidencia.",
    "worked_example": "Una predicción de lluvia del 70 % no equivale a certeza de que lloverá.",
    "question": "¿Qué significa una probabilidad de 70 %?",
    "options": [
      "Hay incertidumbre: el evento no es seguro.",
      "El evento ocurrirá sin falta.",
      "Es imposible que no ocurra.",
      "Todos los lugares tendrán igual resultado."
    ],
    "answer": 0,
    "feedback": "Una probabilidad menor que 100 % admite que el evento no suceda.",
    "status": "draft"
  },
  {
    "slug": "estadistica",
    "title": "Variación, muestras e inferencias",
    "explanation": "La estadística permite resumir datos y estimar patrones sin perder de vista incertidumbre y sesgos.",
    "worked_example": "Medir rendimientos de una sola obra no basta para estimar el desempeño de todas las regiones.",
    "question": "¿Cuál riesgo aparece con una muestra poco representativa?",
    "options": [
      "Conclusiones sesgadas sobre la población.",
      "Precisión garantizada.",
      "Desaparición de variación.",
      "Ausencia de incertidumbre."
    ],
    "answer": 0,
    "feedback": "La selección de casos afecta qué tan generalizables son los resultados.",
    "status": "draft"
  },
  {
    "slug": "algoritmos",
    "title": "Resolver problemas paso a paso",
    "explanation": "Un algoritmo especifica una secuencia finita de operaciones y condiciones que puede comprobarse.",
    "worked_example": "Clasificar mediciones: verificar unidad, descartar faltantes documentados, agrupar y calcular promedios.",
    "question": "¿Qué mejora un algoritmo?",
    "options": [
      "Instrucciones claras y reproducibles.",
      "Pasos ambiguos.",
      "Cambios no registrados.",
      "Resultados imposibles de verificar."
    ],
    "answer": 0,
    "feedback": "La reproducibilidad permite comprobar y corregir el proceso.",
    "status": "draft"
  },
  {
    "slug": "programacion",
    "title": "Convertir algoritmos en programas",
    "explanation": "Programar consiste en expresar instrucciones para una computadora y comprobar su comportamiento.",
    "worked_example": "Una función calcula costo total usando cantidad y precio, con pruebas para entradas válidas y erróneas.",
    "question": "¿Cuál práctica ayuda a detectar errores?",
    "options": [
      "Probar casos normales y límites.",
      "Omitir toda validación.",
      "Suponer que siempre funcionará.",
      "No registrar resultados."
    ],
    "answer": 0,
    "feedback": "Las pruebas ayudan a identificar comportamientos inesperados.",
    "status": "draft"
  },
  {
    "slug": "sensores",
    "title": "De fenómenos a señales",
    "explanation": "Un sensor transforma una propiedad del entorno en una señal; calibración y frecuencia de muestreo importan.",
    "worked_example": "Un sensor de humedad del suelo puede dar lecturas engañosas si se instala o calibra mal.",
    "question": "¿Qué debe verificarse al interpretar un sensor?",
    "options": [
      "Calibración y condiciones de medición.",
      "Solo el diseño exterior.",
      "Su nombre comercial.",
      "El color de la pantalla."
    ],
    "answer": 0,
    "feedback": "La calidad de la lectura depende de cómo y dónde se mide.",
    "status": "draft"
  },
  {
    "slug": "investigacion_usuarios",
    "title": "Escuchar, observar y contrastar",
    "explanation": "La investigación con usuarios combina entrevistas, observación y pruebas para descubrir necesidades.",
    "worked_example": "Usuarios pueden declarar que usan una opción, pero una prueba revela dificultades de navegación.",
    "question": "¿Qué método muestra problemas de uso reales?",
    "options": [
      "Observar tareas realizadas por usuarios.",
      "Suponer preferencias del equipo.",
      "Evitar pruebas.",
      "Preguntar solo a quien desarrolló el producto."
    ],
    "answer": 0,
    "feedback": "La observación directa complementa los testimonios y descubre fricciones.",
    "status": "draft"
  },
  {
    "slug": "aprendizaje_automatico",
    "title": "Modelos que aprenden de datos",
    "explanation": "El aprendizaje automático detecta patrones en ejemplos; desempeño, sesgos y generalización deben evaluarse.",
    "worked_example": "Un modelo estima demanda de agua a partir de registros históricos, pero cambios de clima pueden alterar su precisión.",
    "question": "¿Qué NO garantiza entrenar un modelo con datos históricos?",
    "options": [
      "Acertar siempre en situaciones futuras.",
      "Encontrar correlaciones.",
      "Generar predicciones.",
      "Evaluar datos de prueba."
    ],
    "answer": 0,
    "feedback": "Los patrones pueden cambiar y el conjunto de entrenamiento puede no representar el futuro.",
    "status": "draft"
  },
  {
    "slug": "bioinformatica",
    "title": "Biología y programación juntas",
    "explanation": "La bioinformática usa métodos computacionales para estudiar secuencias, estructuras y datos biológicos.",
    "worked_example": "Comparar miles de secuencias genéticas puede ayudar a investigar similitudes entre organismos.",
    "question": "¿Qué combinación caracteriza a la bioinformática?",
    "options": [
      "Biología y análisis computacional.",
      "Biología sin datos.",
      "Solo diseño gráfico.",
      "Mecánica sin modelos."
    ],
    "answer": 0,
    "feedback": "La disciplina integra preguntas biológicas con algoritmos y estadística.",
    "status": "draft"
  },
  {
    "slug": "gemelos_digitales",
    "title": "Representaciones conectadas al mundo físico",
    "explanation": "Un gemelo digital integra un modelo con información actualizada del sistema real para analizar su estado.",
    "worked_example": "Un modelo de puente se alimenta de sensores para estudiar tendencias de deformación y escenarios de mantenimiento.",
    "question": "¿En qué se distingue de un modelo 3D estático?",
    "options": [
      "Integra datos del sistema físico a lo largo del tiempo.",
      "Solo tiene más colores.",
      "Debe ser una animación.",
      "No requiere información externa."
    ],
    "answer": 0,
    "feedback": "La actualización con datos del sistema real es parte central del enfoque.",
    "status": "draft"
  },
  {
    "slug": "robotica",
    "title": "Percibir, decidir y actuar",
    "explanation": "La robótica integra sensores, controladores y actuadores para interactuar con el mundo físico.",
    "worked_example": "Un robot móvil mide distancia, decide una trayectoria y ajusta sus motores.",
    "question": "¿Qué componente permite actuar físicamente?",
    "options": [
      "Actuador.",
      "Archivo PDF.",
      "Lista de contactos.",
      "Color del chasis."
    ],
    "answer": 0,
    "feedback": "El actuador convierte órdenes de control en movimiento u otra acción.",
    "status": "draft"
  },
  {
    "slug": "ecosistemas",
    "title": "Interacciones en el ambiente",
    "explanation": "Un ecosistema involucra seres vivos y condiciones físicas conectadas por flujos de materia y energía.",
    "worked_example": "La urbanización puede modificar infiltración del agua, hábitat y temperatura local.",
    "question": "¿Cuál ejemplo representa una interacción ecosistémica?",
    "options": [
      "Plantas, suelo y agua influyen entre sí.",
      "Un objeto se estudia sin entorno.",
      "Solo importa una especie aislada.",
      "El clima no afecta a los seres vivos."
    ],
    "answer": 0,
    "feedback": "Los componentes bióticos y abióticos están conectados.",
    "status": "draft"
  },
  {
    "slug": "gobernanza_ia",
    "title": "Supervisar IA con responsabilidad",
    "explanation": "Gobernar IA implica definir usos permitidos, responsabilidades, evaluación de sesgos y mecanismos de revisión.",
    "worked_example": "Una herramienta para orientar estudiantes debe permitir correcciones y no tomar decisiones definitivas sin supervisión.",
    "question": "¿Qué medida mejora la gobernanza de una IA?",
    "options": [
      "Auditorías y revisión de decisiones relevantes.",
      "Opacidad total.",
      "Ausencia de responsables.",
      "Impedir toda apelación."
    ],
    "answer": 0,
    "feedback": "La supervisión y la trazabilidad mejoran la rendición de cuentas.",
    "status": "draft"
  }
];
export const lessonBySlug:Record<string,LessonDraft> = Object.fromEntries(lessonDrafts.map(lesson => [lesson.slug, lesson]));
