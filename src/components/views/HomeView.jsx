import React from 'react';
import { useGraph } from '../../context/GraphContext';
import FlowGraph from '../graph/FlowGraph';
import {
  Share2,
  PlayCircle,
  FlaskConical,
  Presentation,
  ArrowRight,
  Sparkles,
  Users,
  Video,
  Layers,
  Calculator,
  Compass,
} from 'lucide-react';

export default function HomeView({ setActiveView }) {
  const { lemma, users, videos, edges, setActiveLabTab, setHighlightedPath } = useGraph();

  const handleOpenTheory = (e, theoryId) => {
    e.stopPropagation();
    setActiveView('theory');
    setTimeout(() => {
      const el = document.getElementById(theoryId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        el.style.boxShadow = '0 0 25px rgba(254, 44, 85, 0.6)';
        setTimeout(() => {
          if (el) el.style.boxShadow = '';
        }, 2200);
      }
    }, 150);
  };

  const concepts = [
    {
      title: 'Grafos Bipartitos',
      desc: 'Dos conjuntos disjuntos de vértices (Usuarios y Videos). Ninguna arista une dos elementos del mismo grupo.',
      icon: Layers,
      color: '#FFFFFF',
      action: () => setActiveView('guided'),
      actionLabel: 'Ver simulación guiada',
      theoryId: 'concept-bipartito',
    },
    {
      title: 'Vértices y Aristas',
      desc: 'Los puntos representan usuarios y videos; las líneas representan una interacción directa de «Me gusta».',
      icon: Share2,
      color: '#FE2C55',
      action: () => {
        setActiveLabTab('recommendations');
        setActiveView('lab');
      },
      actionLabel: 'Explorar en Laboratorio',
      theoryId: 'concept-vertices',
    },
    {
      title: 'Grado de un Vértice',
      desc: 'Cantidad de conexiones de un punto: cuántos videos le gustaron a un usuario o cuántos likes recibió un video.',
      icon: Users,
      color: '#FFFFFF',
      action: () => {
        setActiveLabTab('math');
        setActiveView('lab');
      },
      actionLabel: 'Ver tabla de grados en Lab',
      theoryId: 'concept-grado',
    },
    {
      title: 'Lema del Apretón de Manos',
      desc: 'La suma de todos los grados siempre duplica el número de aristas: ∑ deg(v) = 2 · |E| (18 = 2 × 9).',
      icon: Calculator,
      color: '#10B981',
      action: () => {
        setActiveLabTab('math');
        setActiveView('lab');
      },
      actionLabel: 'Calculadora Euler en vivo',
      theoryId: 'concept-euler',
    },
    {
      title: 'Trayectorias y Longitud',
      desc: 'Caminos de longitud 2 entre usuarios para identificar intereses comunes (A → V1 → B y A → V2 → B).',
      icon: Compass,
      color: '#FACC15',
      action: () => {
        setActiveLabTab('paths');
        setHighlightedPath(['A', 'V1', 'B']);
        setActiveView('lab');
      },
      actionLabel: 'Analizar trayectorias BFS',
      theoryId: 'concept-trayectorias',
    },
    {
      title: 'Motor de Recomendaciones',
      desc: 'Trayectorias de longitud 3 que conectan un usuario objetivo con un video no visto mediante vecinos similares.',
      icon: Sparkles,
      color: '#FE2C55',
      action: () => {
        setActiveLabTab('recommendations');
        setActiveView('lab');
      },
      actionLabel: 'Simulador de recomendaciones',
      theoryId: 'concept-recomendaciones',
    },
  ];

  return (
    <div style={{ maxWidth: '1540px', margin: '0 auto', padding: '2rem 1.25rem' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto 3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
          <span className="badge badge-red" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
            Universidad Mariano Gálvez de Guatemala
          </span>
          <span className="badge badge-white" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
            Proyecto Final — Matemática Discreta
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.1rem, 5.2vw, 3.5rem)',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            background: 'linear-gradient(135deg, #FFFFFF 40%, #FE2C55 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Descubre cómo funcionan las recomendaciones mediante{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #FE2C55 0%, #FF6584 100%)',
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
          Los usuarios y los videos se representan como <strong>vértices</strong>, mientras que sus
          interacciones de «Me gusta» forman las <strong>aristas</strong>. Explora de forma interactiva
          cómo la matemática discreta modela el descubrimiento de intereses y el ciclo de contenido.
        </p>

        {/* CTA Buttons in Red & White */}
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
            className="btn btn-white btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <FlaskConical size={20} />
            <span>Laboratorio interactivo</span>
          </button>

          <button
            onClick={() => setActiveView('presentation')}
            className="btn btn-secondary btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #FE2C55', color: '#FE2C55' }}
          >
            <Presentation size={20} />
            <span>Modo Exposición</span>
          </button>
        </div>
      </div>

      {/* Free Canvas Scenario Active Alert */}
      {users.length === 0 && videos.length === 0 && (
        <div
          style={{
            backgroundColor: 'rgba(225, 29, 72, 0.12)',
            border: '1.5px solid var(--border-red)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <strong style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>
              🎨 Estás en el Escenario 6: Crear mi propia red (Lienzo libre)
            </strong>
            <p style={{ fontSize: '0.82rem', color: '#CBD5E1', margin: '3px 0 0 0' }}>
              El grafo está en blanco para que lo diseñes. Abre el Laboratorio Interactivo para agregar usuarios, videos y conexiones con las herramientas de edición.
            </p>
          </div>
          <button
            onClick={() => setActiveView('lab')}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span>Ir al Laboratorio</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Quick Metrics Bar in Red & White */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
      >
        <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: '#FFFFFF', textTransform: 'uppercase', fontWeight: 800 }}>
            Usuarios (U)
          </div>
          <div style={{ fontFamily: 'Fira Code', fontSize: '1.85rem', fontWeight: 900, color: '#FFFFFF', marginTop: 4 }}>
            {users.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vértices de personas</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: '#FE2C55', textTransform: 'uppercase', fontWeight: 800 }}>
            Videos (V)
          </div>
          <div style={{ fontFamily: 'Fira Code', fontSize: '1.85rem', fontWeight: 900, color: '#FE2C55', marginTop: 4 }}>
            {videos.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vértices temáticos</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: '#FFFFFF', textTransform: 'uppercase', fontWeight: 800 }}>
            Aristas (|E|)
          </div>
          <div style={{ fontFamily: 'Fira Code', fontSize: '1.85rem', fontWeight: 900, color: '#FFFFFF', marginTop: 4 }}>
            {edges.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interacciones de Me gusta</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: '#10B981', textTransform: 'uppercase', fontWeight: 800 }}>
            Suma de Grados
          </div>
          <div style={{ fontFamily: 'Fira Code', fontSize: '1.85rem', fontWeight: 900, color: '#10B981', marginTop: 4 }}>
            {lemma.totalDegree} = 2 · {lemma.edgeCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lema Euler comprobado</div>
        </div>
      </div>

      {/* Main Interactive Graph Visualizer Section */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Share2 size={22} color="#FE2C55" />
              <span>Lienzo del Grafo Bipartito (React Flow)</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Pasa el cursor sobre un usuario para iluminar sus conexiones directas o haz clic sobre el Usuario A para simular recomendaciones.
            </p>
          </div>
          <button onClick={() => setActiveView('lab')} className="btn btn-secondary btn-sm">
            <span>Abrir laboratorio completo</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <FlowGraph height="580px" interactive={true} />
      </div>

      {/* Core Mathematical Concepts Grid */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
            Conceptos Matemáticos Evaluados en Clase
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
            Cada concepto del informe se materializa con rigor y claridad pedagógica dentro de este simulador.
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
                style={{
                  padding: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                }}
                onClick={concept.action}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(225, 29, 72, 0.12)',
                      color: concept.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border-red)',
                    }}
                  >
                    <Icon size={22} />
                  </div>

                  <span
                    onClick={(e) => handleOpenTheory(e, concept.theoryId)}
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      padding: '2px 6px',
                    }}
                    title="Ver explicación formal en Fundamentos Teóricos"
                  >
                    📖 Ver Teoría
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                  {concept.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {concept.desc}
                </p>

                <div style={{ marginTop: 'auto' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      concept.action();
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      fontSize: '0.8rem',
                      color: concept.color,
                      borderColor: `${concept.color}50`,
                    }}
                  >
                    <span>{concept.actionLabel}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
