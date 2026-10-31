import React, { useState, useEffect } from 'react';
import { useGraph } from '../../context/GraphContext';
import FlowGraph from '../graph/FlowGraph';
import {
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Layers,
  Calculator,
  Compass,
  Heart,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PresentationModeView({ setActiveView }) {
  const {
    users,
    videos,
    edges,
    degrees,
    lemma,
    setHighlightedPath,
    setRecommendedNodeId,
    setSelectedNodeId,
    simulateLike,
    resetToOriginal,
  } = useGraph();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Estado para la pregunta interactiva del público
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const SLIDES = [
    {
      index: 0,
      title: '07. Cálculo del Grado de los Vértices',
      subtitle: '¿Cuántas conexiones tiene cada elemento de la red?',
      content: (
        <div>
          <p style={{ fontSize: '1.15rem', color: '#E2E8F0', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            El grado <code style={{ color: '#22D3EE' }}>deg(v)</code> cuenta las aristas que inciden en cada vértice:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ backgroundColor: 'rgba(34, 211, 238, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #22D3EE' }}>
              <strong style={{ color: '#22D3EE', display: 'block', marginBottom: 4 }}>Usuarios (U):</strong>
              <div style={{ fontFamily: 'Fira Code', fontSize: '1.1rem' }}>
                A = 2 &nbsp;|&nbsp; B = 3<br />
                C = 2 &nbsp;|&nbsp; D = 2
              </div>
              <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>B interactuó con más videos (V1, V2, V3).</span>
            </div>

            <div style={{ backgroundColor: 'rgba(244, 114, 182, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #F472B6' }}>
              <strong style={{ color: '#F472B6', display: 'block', marginBottom: 4 }}>Videos (V):</strong>
              <div style={{ fontFamily: 'Fira Code', fontSize: '1.1rem' }}>
                V1 = 2 &nbsp;|&nbsp; V2 = 2 &nbsp;|&nbsp; V3 = 2<br />
                V4 = 2 &nbsp;|&nbsp; V5 = 1
              </div>
              <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>V5 tiene menos interacciones registradas.</span>
            </div>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#FCD34D', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            ⚠️ <strong>Aclaración:</strong> Un grado mayor refleja más actividad en el modelo, pero no mide popularidad social ni adicción.
          </div>
        </div>
      ),
      setup: () => {
        setSelectedNodeId('B');
        setHighlightedPath([]);
        setRecommendedNodeId(null);
      },
    },
    {
      index: 1,
      title: '08. Comprobación Matemática: Lema del Apretón de Manos',
      subtitle: 'La suma de los grados duplica el número de aristas',
      content: (
        <div>
          <div style={{ fontFamily: 'Fira Code', fontSize: '1.6rem', color: '#22C55E', textAlign: 'center', marginBottom: '1.5rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            Σ deg(v) = 2 · |E|
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1.1rem' }}>
            <li>🔵 Suma grados de usuarios: <code style={{ color: '#22D3EE' }}>2 + 3 + 2 + 2 = 9</code></li>
            <li>🌸 Suma grados de videos: <code style={{ color: '#F472B6' }}>2 + 2 + 2 + 2 + 1 = 9</code></li>
            <li>🟣 Suma total de grados: <code style={{ color: '#A855F7' }}>9 + 9 = 18</code></li>
            <li>🟢 Número de aristas |E| = 9 &nbsp;→&nbsp; <code style={{ color: '#22C55E' }}>18 = 2 × 9 (18 = 18)</code></li>
          </ul>
          <p style={{ marginTop: '1.25rem', fontSize: '0.95rem', color: '#CBD5E1' }}>
            <strong>¿Por qué?</strong> Cada arista tiene dos extremos, por lo que al sumar los grados de todos los vértices, cada línea se cuenta exactamente dos veces.
          </p>
        </div>
      ),
      setup: () => {
        setSelectedNodeId(null);
        setHighlightedPath([]);
        setRecommendedNodeId(null);
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      },
    },
    {
      index: 2,
      title: '09. Análisis de Trayectorias entre Usuarios',
      subtitle: 'Descubrir afinidades mediante caminos de longitud 2',
      content: (
        <div>
          <p style={{ fontSize: '1.1rem', color: '#E2E8F0', lineHeight: 1.5, marginBottom: '1rem' }}>
            En un grafo bipartito, dos usuarios no pueden estar unidos directamente. Sin embargo, están conectados mediante los videos que ambos vieron:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.25rem' }}>
            <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', border: '1px solid #A855F7', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontFamily: 'Fira Code', fontSize: '1.1rem', color: '#D8B4FE' }}>
              Camino 1: A → V1 → B &nbsp;(longitud 2)
            </div>
            <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', border: '1px solid #A855F7', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontFamily: 'Fira Code', fontSize: '1.1rem', color: '#D8B4FE' }}>
              Camino 2: A → V2 → B &nbsp;(longitud 2)
            </div>
          </div>
          <p style={{ fontSize: '0.95rem', color: '#CBD5E1' }}>
            La existencia de dos caminos de longitud 2 confirma que A y B comparten dos gustos idénticos (V1: Gatos y V2: Perros).
          </p>
        </div>
      ),
      setup: () => {
        setSelectedNodeId(null);
        setHighlightedPath(['A', 'V1', 'B']);
        setRecommendedNodeId(null);
      },
    },
    {
      index: 3,
      title: '10. Pregunta al Público y Simulación de Recomendación',
      subtitle: 'Demostración interactiva en clase',
      content: (
        <div>
          <div style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', border: '1px solid #EC4899', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#EC4899', fontWeight: 800 }}>PREGUNTA PARA EL PÚBLICO:</span>
            <p style={{ fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 700, marginTop: 4 }}>
              «Si A y B comparten intereses y B interactuó con V3, ¿qué video recomendarías a A?»
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            {['V3', 'V4', 'V5'].map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setQuizAnswer(opt);
                  setQuizSubmitted(true);
                  if (opt === 'V3') {
                    setRecommendedNodeId('V3');
                    setHighlightedPath(['A', 'V1', 'B', 'V3']);
                    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
                  }
                }}
                className={`btn btn-lg ${
                  quizAnswer === opt
                    ? opt === 'V3'
                      ? 'btn-success'
                      : 'btn-secondary'
                    : 'btn-secondary'
                }`}
                style={{ flex: 1, fontSize: '1.1rem', fontWeight: 800 }}
              >
                Opción: {opt}
              </button>
            ))}
          </div>

          {quizSubmitted && (
            <div
              style={{
                backgroundColor: quizAnswer === 'V3' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: quizAnswer === 'V3' ? '1px solid #22C55E' : '1px solid #EF4444',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                color: '#FFFFFF',
              }}
            >
              {quizAnswer === 'V3' ? (
                <div>
                  <strong style={{ color: '#22C55E', display: 'flex', alignItems: 'center', gap: 6, fontSize: '1.05rem' }}>
                    <CheckCircle2 size={20} /> ¡Correcto! La recomendación para A es V3.
                  </strong>
                  <p style={{ fontSize: '0.9rem', color: '#CBD5E1', marginTop: 4 }}>
                    <strong>Justificación matemática:</strong> La trayectoria <code style={{ color: '#22D3EE' }}>A → V1 → B → V3</code> tiene longitud 3. Como A y B son afines y B vio V3, V3 es el candidato con mayor similitud estructural.
                  </p>
                </div>
              ) : (
                <div>
                  <strong style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <XCircle size={18} /> Incorrecto. La respuesta óptima es V3.
                  </strong>
                  <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: 2 }}>
                    V4 y V5 fueron vistos por C y D, quienes no comparten videos en común con A en el estado inicial.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ),
      setup: () => {
        setSelectedNodeId(null);
        setRecommendedNodeId('V3');
        setHighlightedPath(['A', 'V1', 'B', 'V3']);
      },
    },
    {
      index: 4,
      title: '11. Relación con el Consumo Repetitivo',
      subtitle: '¿Cómo una nueva interacción modifica el grafo?',
      content: (
        <div>
          <p style={{ fontSize: '1.1rem', color: '#E2E8F0', lineHeight: 1.5, marginBottom: '1rem' }}>
            Si el usuario A acepta la recomendación y marca «Me gusta» a V3:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ backgroundColor: 'var(--bg-surface-card)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Antes</div>
              <div style={{ fontFamily: 'Fira Code', fontSize: '1rem', marginTop: 2 }}>
                deg(A)=2, deg(V3)=2<br />
                |E|=9, Σ deg=18
              </div>
            </div>
            <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid #22C55E' }}>
              <div style={{ fontSize: '0.75rem', color: '#22C55E', textTransform: 'uppercase', fontWeight: 700 }}>Después (A, V3)</div>
              <div style={{ fontFamily: 'Fira Code', fontSize: '1rem', marginTop: 2, color: '#86EFAC' }}>
                deg(A)=3, deg(V3)=3<br />
                |E|=10, Σ deg=20 (20 = 2×10)
              </div>
            </div>
          </div>
          <button
            onClick={() => simulateLike('A', 'V3')}
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            <Heart size={16} fill="white" /> Simular nueva conexión (A, V3) en vivo
          </button>
          <div style={{ fontSize: '0.85rem', color: '#FCD34D', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            ⚠️ <strong>Aclaración oficial:</strong> La personalización de contenido facilita continuar viendo videos afines, pero no equivale a una prueba clínica de adicción.
          </div>
        </div>
      ),
      setup: () => {
        setSelectedNodeId(null);
        setHighlightedPath([]);
        setRecommendedNodeId(null);
      },
    },
    {
      index: 5,
      title: '12. Conclusiones Generales del Proyecto',
      subtitle: 'Universidad Mariano Gálvez de Guatemala — Matemática Discreta',
      content: (
        <div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '1rem' }}>
            <li style={{ display: 'flex', gap: 10 }}>
              <span style={{ color: '#22D3EE', fontWeight: 800 }}>1.</span>
              <span>La teoría de grafos permite convertir un fenómeno digital cotidiano (recomendaciones de TikTok) en un modelo matemático computable.</span>
            </li>
            <li style={{ display: 'flex', gap: 10 }}>
              <span style={{ color: '#F472B6', fontWeight: 800 }}>2.</span>
              <span>El lema del apretón de manos (18 = 2×9 y 20 = 2×10) garantiza la consistencia del conteo en todo momento.</span>
            </li>
            <li style={{ display: 'flex', gap: 10 }}>
              <span style={{ color: '#A855F7', fontWeight: 800 }}>3.</span>
              <span>Las trayectorias de longitud 2 identifican intereses compartidos y las de longitud 3 fundamentan recomendaciones personalizadas.</span>
            </li>
            <li style={{ display: 'flex', gap: 10 }}>
              <span style={{ color: '#22C55E', fontWeight: 800 }}>4.</span>
              <span>Con solo 9 vértices y 9 aristas, se pueden explicar con rigor los pilares de la personalización de contenido digital.</span>
            </li>
          </ul>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              onClick={() => {
                confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
              }}
              className="btn btn-success btn-lg"
            >
              <Sparkles size={18} /> ¡Agradecemos su atención!
            </button>
          </div>
        </div>
      ),
      setup: () => {
        setSelectedNodeId(null);
        setHighlightedPath([]);
        setRecommendedNodeId(null);
      },
    },
  ];

  // Configurar slide al cambiar
  useEffect(() => {
    const s = SLIDES[currentSlide];
    if (s && s.setup) s.setup();
  }, [currentSlide]);

  // Manejo de teclado (Flechas izq/der, Espacio, Tecla F)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        if (currentSlide < SLIDES.length - 1) setCurrentSlide((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentSlide > 0) setCurrentSlide((prev) => prev - 1);
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const activeSlide = SLIDES[currentSlide];

  return (
    <div style={{ maxWidth: '1560px', margin: '0 auto', padding: '1.25rem' }}>
      {/* Top Slide Navigation Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span className="badge badge-accent" style={{ fontSize: '0.8rem' }}>
            DIAPOSITIVA {currentSlide + 1} DE {SLIDES.length}
          </span>
          <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginTop: 4 }}>
            {activeSlide.title}
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {activeSlide.subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="btn btn-secondary btn-sm"
          >
            <ChevronLeft size={16} /> Anterior
          </button>

          <button
            onClick={() => setCurrentSlide((prev) => Math.min(SLIDES.length - 1, prev + 1))}
            disabled={currentSlide === SLIDES.length - 1}
            className="btn btn-primary btn-sm"
          >
            Siguiente <ChevronRight size={16} />
          </button>

          <button onClick={toggleFullscreen} className="btn btn-secondary btn-sm" title="Pantalla completa (tecla F)">
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>

          <button onClick={() => setActiveView('lab')} className="btn btn-ghost btn-sm">
            Salir al Laboratorio
          </button>
        </div>
      </div>

      {/* Main Grid: Presentation Slide Content + Big Graph Visualizer */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.25fr)',
          gap: '1.5rem',
          alignItems: 'start',
        }}
        className="presentation-grid"
      >
        <style>{`
          @media (max-width: 1024px) {
            .presentation-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        {/* Slide Content Card */}
        <div className="card" style={{ padding: '2rem' }}>
          {activeSlide.content}

          {/* Slide Indicator Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '2rem' }}>
            {SLIDES.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: idx === currentSlide ? 28 : 10,
                  height: 10,
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: idx === currentSlide ? '#22D3EE' : 'var(--border-subtle)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Live Graph Canvas */}
        <div>
          <FlowGraph height="640px" interactive={true} />
        </div>
      </div>
    </div>
  );
}
