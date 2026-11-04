import FamilyBridgeExplorer from '@/components/FamilyBridgeExplorer';
export const metadata = { title: 'Puentes interdisciplinarios | Thrive', description: 'Conexiones entre disciplinas, conceptos y posibles aplicaciones.' };
export default function BridgesPage() {
  return <main className="concept-page"><a href="/">← Thrive</a>
    <div className="eyebrow">THRIVE · ENCUENTROS ENTRE DISCIPLINAS</div>
    <h1>Lo que aparece al conectar ideas.</h1>
    <p>Elige dos áreas académicas para descubrir fundamentos compartidos, relaciones directas y oportunidades de investigación relacionadas.</p>
    <FamilyBridgeExplorer/>
  </main>;
}
