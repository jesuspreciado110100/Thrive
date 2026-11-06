import PersonalizedLearning from '@/components/PersonalizedLearning';

export const metadata = {
  title: 'Mi trayectoria de aprendizaje | Thrive',
  description: 'Rutas educativas personalizadas, progreso individual y conexiones interdisciplinarias.'
};

export default function LearningPage() {
  return <main className="learning-page">
    <a href="/">← Inicio Thrive</a>
    <div className="eyebrow">THRIVE ACADEMY · APRENDIZAJE PERSONALIZADO</div>
    <h1>Diseña tu trayectoria.</h1>
    <p>Aprende desde los conceptos básicos, conserva tu avance cuando inicies sesión y descubre nuevas aplicaciones a medida que conectas conocimientos.</p>
    <PersonalizedLearning/>
  </main>;
}
