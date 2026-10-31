import React from 'react';
import { useGraph } from '../../context/GraphContext';
import FlowGraph from '../graph/FlowGraph';
import {
  Share2,
  PlayCircle,
  FlaskConical,
  BookOpen,
  Presentation,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Video,
  Layers,
  Calculator,
  Compass,
} from 'lucide-react';

export default function HomeView({ setActiveView }) {
  const { degrees, lemma, users, videos, edges } = useGraph();

  const concepts = [
    {
      title: 'Grafos Bipartitos',
      desc: 'Dos conjuntos disjuntos de vértices (Usuarios y Videos). Ninguna arista une dos elementos del mismo grupo.',
      icon: Layers,
      color: '#22D3EE',
    },
    {
      title: 'Vértices y Aristas',
      desc: 'Los puntos representan usuarios y videos; las líneas representan una interacción directa de «Me gusta».',
      icon: Share2,
      color: '#F472B6',
    },
    {
      title: 'Grado de un Vértice',
      desc: 'Cantidad de conexiones de un punto: cuántos videos le gustaron a un usuario o cuántos likes recibió un video.',
      icon: Users,
      color: '#38BDF8',
    },
    {
      title: 'Lema del Apretón de Manos',
      desc: 'La suma de todos los grados siempre duplica el número de aristas: Σ deg(v) = 2 · |E| (18 = 2 × 9).',
      icon: Calculator,
      color: '#22C55E',
    },
    {
      title: 'Trayectorias y Longitud',
      desc: 'Caminos de longitud 2 entre usuarios para identificar intereses comunes (A → V1 → B y A → V2 → B).',
      icon: Compass,
      color: '#A855F7',
    },
    {
      title: 'Motor de Recomendaciones',
      desc: 'Trayectorias de longitud 3 que conectan un usuario objetivo con un video no visto mediante vecinos similares.',
      icon: Sparkles,
      color: '#EC4899',
    },
  ];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem 1.25rem' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
          <span className="badge badge-cyan" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
            Universidad Mariano Gálvez de Guatemala
          </span>
          <span className="badge badge-purple" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
            Proyecto Final — Matemática Discreta
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            background: 'linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Descubre cómo funcionan las recomendaciones mediante{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #22D3EE 0%, #F472B6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            teoría de grafos
          </span>
        </h1>

        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}
        >
          Los usuarios y los videos pueden representarse como <strong>vértices</strong>, mientras que sus
          interacciones de «Me gusta» forman las <strong>aristas</strong>. Explora de forma interactiva
          cómo la matemática discreta modela el descubrimiento de intereses compartidos.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveView('guided')}
            className="btn btn-primary btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <PlayCircle size={20} />
            <span>Comenzar simulación</span>
          </button>

          <button
            onClick={() => setActiveView('lab')}
            className="btn btn-secondary btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <FlaskConical size={20} />
            <span>Laboratorio interactivo</span>
          </button>

          <button
            onClick={() => setActiveView('presentation')}
            className="btn btn-accent btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <Presentation size={20} />
            <span>Modo Exposición</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
      >
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#22D3EE', textTransform: 'uppercase', fontWeight: 700 }}>
            Usuarios (U)
          </div>
          <div style={{ fontFamily: 'Fira Code', fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
            {users.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vértices de personas</div>
        </div>

        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#F472B6', textTransform: 'uppercase', fontWeight: 700 }}>
            Videos (V)
          </div>
          <div style={{ fontFamily: 'Fira Code', fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
            {videos.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vértices de contenido</div>
        </div>

        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#FFFFFF', textTransform: 'uppercase', fontWeight: 700 }}>
            Aristas (|E|)
          </div>
          <div style={{ fontFamily: 'Fira Code', fontSize: '1.75rem', fontWeight: 800, color: '#38BDF8', marginTop: 4 }}>
            {edges.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interacciones de Me gusta</div>
        </div>

        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#22C55E', textTransform: 'uppercase', fontWeight: 700 }}>
            Suma de Grados
          </div>
          <div style={{ fontFamily: 'Fira Code', fontSize: '1.75rem', fontWeight: 800, color: '#22C55E', marginTop: 4 }}>
            {lemma.totalDegree} = 2 · {lemma.edgeCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lema comprobado</div>
        </div>
      </div>

      {/* Main Interactive Graph Visualizer Section */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Share2 size={22} color="#22D3EE" />
              Lienzo del Grafo Bipartito
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Pasa el cursor sobre cualquier usuario para ver sus videos relacionados o selecciona un video para ver a sus espectadores.
            </p>
          </div>
          <button onClick={() => setActiveView('lab')} className="btn btn-secondary btn-sm">
            <span>Abrir controles completos</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <FlowGraph height="560px" interactive={true} />
      </div>

      {/* Core Mathematical Concepts Grid */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
            Conceptos Matemáticos del Curso
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Este simulador materializa los temas evaluados en clase mediante un laboratorio interactivo real.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {concepts.map((concept, idx) => {
            const Icon = concept.icon;
            return (
              <div
                key={idx}
                className="card card-interactive"
                style={{ padding: '1.5rem', cursor: 'pointer' }}
                onClick={() => setActiveView('theory')}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: `${concept.color}15`,
                    color: concept.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                  {concept.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {concept.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
