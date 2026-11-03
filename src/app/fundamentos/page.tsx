import ConceptExplorer from '@/components/ConceptExplorer';
export const metadata = { title: 'Fundamentos y conexiones | Thrive', description: 'Desde conceptos básicos hasta aplicaciones interdisciplinarias.' };
export default function FoundationsPage() {
  return <main className="concept-page"><a href="/">← Thrive</a>
    <div className="eyebrow">THRIVE · CONOCIMIENTO CONECTADO</div>
    <h1>De lo fundamental a lo posible.</h1>
    <p>Descubre de dónde parte una idea, qué necesitas comprender para profundizar y cómo puede conectar con otras disciplinas.</p>
    <p><a href="/universe">Ver universo 3D →</a></p>
    <ConceptExplorer/>
  </main>;
}
