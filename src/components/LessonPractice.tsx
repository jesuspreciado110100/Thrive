'use client';
import { useState } from 'react';
import { lessonBySlug } from '@/lib/lessonDrafts';

export default function LessonPractice({ slug }: { slug: string }) {
  const lesson = lessonBySlug[slug];
  const [selected, setSelected] = useState<number | null>(null);
  if (!lesson) return <p className="concept-disclaimer">Esta lección está pendiente de desarrollo editorial.</p>;
  const answered = selected !== null;
  const correct = selected === lesson.answer;
  return <section className="mini-lesson" aria-label={'Lección introductoria: ' + lesson.title}>
    <small>Microlección de muestra · borrador editorial · resultado solo en esta sesión</small>
    <h3>{lesson.title}</h3>
    <p>{lesson.explanation}</p>
    <div className="lesson-example"><strong>Ejemplo aplicado</strong><p>{lesson.worked_example}</p></div>
    <div className="lesson-check">
      <h4>Comprueba tu comprensión</h4>
      <p>{lesson.question}</p>
      <div className="lesson-options">
        {lesson.options.map((option, index) => <button
          type="button" key={index}
          disabled={answered}
          aria-pressed={selected === index}
          className={'lesson-option' + (answered && index === lesson.answer ? ' correct' : '') + (selected === index && !correct ? ' incorrect' : '')}
          onClick={() => setSelected(index)}>{option}</button>)}
      </div>
      {answered && <div role="status" className="lesson-feedback">
        <strong>{correct ? '¡Correcto!' : 'No es la respuesta más adecuada.'}</strong>
        <p>{lesson.feedback}</p>
        <button type="button" onClick={() => setSelected(null)}>Intentar de nuevo</button>
      </div>}
    </div>
    <p className="concept-disclaimer">Actividad orientativa; no certifica una competencia. El contenido requiere revisión de especialistas antes de incorporarse a un plan académico.</p>
  </section>;
}
