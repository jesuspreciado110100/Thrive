import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Thrive | Knowledge Universe', description: 'Plataforma universitaria interdisciplinaria' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}</body></html>; }
