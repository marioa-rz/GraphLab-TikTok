import React, { useState } from 'react';
import { useGraph } from '../../context/GraphContext';
import { Heart, ArrowRight, RotateCcw, Check, Zap, Sparkles, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function NewInteractionSimulator() {
  const {
    edges,
    users,
    videos,
    degrees,
    lemma,
    simulateLike,
    undoLastAction,
    setHighlightedPath,
    setRecommendedNodeId,
  } = useGraph();

  // Comprobar si la interacción (A, V3) ya existe
  const hasA_V3 = edges.some(
    (e) => (e.source === 'A' && e.target === 'V3') || (e.source === 'V3' && e.target === 'A')
  );

  const [activeStep, setActiveStep] = useState(1);

  const handleSimulate = () => {
    if (hasA_V3) return;
    simulateLike('A', 'V3');
    confetti({
      particleCount: 50,
      spread: 65,
      origin: { y: 0.75 },
      colors: ['#FE2C55', '#FFFFFF', '#10B981'],
    });
  };

  const handleShowStep1 = () => {
    setActiveStep(1);
    setHighlightedPath(['A', 'V1', 'B']);
    setRecommendedNodeId(null);
  };

  const handleShowStep2 = () => {
    setActiveStep(2);
    setHighlightedPath(['A', 'V1', 'B', 'V3']);
    setRecommendedNodeId('V3');
  };

  return (
    <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={20} color="#FE2C55" />
            <span>Simulador de Recomendación (Paso a Paso BFS)</span>
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Trayectorias estructuradas para descubrir afinidades y proponer contenido no visto.
          </p>
        </div>

        {hasA_V3 && (
          <button
            onClick={undoLastAction}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#FE2C55' }}
            title="Revertir interacción simulada"
          >
            <RotateCcw size={12} /> Deshacer Me gusta
          </button>
        )}
      </div>

      {/* Stepper Tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        {/* Paso 1 */}
        <div
          onClick={handleShowStep1}
          style={{
            padding: '0.875rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: activeStep === 1 ? 'rgba(225, 29, 72, 0.12)' : 'var(--bg-surface-card)',
            border: activeStep === 1 ? '1.5px solid #FE2C55' : '1px solid var(--border-subtle)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#FE2C55', textTransform: 'uppercase' }}>
              Paso 1: Longitud 2
            </span>
            <span className="badge badge-white" style={{ fontSize: '0.65rem' }}>Afinidad</span>
          </div>
          <div style={{ fontFamily: 'Fira Code', fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 700, marginBottom: 4 }}>
            A → V1 → B
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
            Búsqueda de usuarios con intereses comunes. A y B comparten V1 y V2.
          </p>
        </div>

        {/* Paso 2 */}
        <div
          onClick={handleShowStep2}
          style={{
            padding: '0.875rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: activeStep === 2 ? 'rgba(250, 204, 21, 0.12)' : 'var(--bg-surface-card)',
            border: activeStep === 2 ? '1.5px solid #FACC15' : '1px solid var(--border-subtle)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#FACC15', textTransform: 'uppercase' }}>
              Paso 2: Longitud 3
            </span>
            <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>Sugerencia</span>
          </div>
          <div style={{ fontFamily: 'Fira Code', fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 700, marginBottom: 4 }}>
            A → V1 → B → V3
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
            Detección de video afín no visto. B vio V3, por lo que se recomienda a A.
          </p>
        </div>
      </div>

      {/* Main Interactive CTA Button */}
      <div style={{ marginBottom: '1.25rem' }}>
        <button
          onClick={handleSimulate}
          disabled={hasA_V3}
          className={`btn btn-lg ${hasA_V3 ? 'btn-secondary' : 'btn-primary'}`}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '0.9rem 1.25rem',
            fontSize: '1.02rem',
            fontWeight: 800,
          }}
        >
          {hasA_V3 ? (
            <>
              <Check size={20} color="#10B981" strokeWidth={3} />
              <span>✓ Interacción (A, V3) registrada en el grafo</span>
            </>
          ) : (
            <>
              <Zap size={20} fill="white" />
              <span>Simular Click / Like de Usuario A en V3</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Comparator "Antes / Después" */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1rem',
        }}
      >
        {/* Antes */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.875rem',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>
            Estado Inicial (Antes)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 3 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Grado deg(A):</span>
              <strong style={{ color: '#FFFFFF', fontFamily: 'Fira Code' }}>2</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 3 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Grado deg(V3):</span>
              <strong style={{ color: '#FE2C55', fontFamily: 'Fira Code' }}>2</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 3 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Aristas |E|:</span>
              <strong style={{ color: '#FFFFFF', fontFamily: 'Fira Code' }}>9</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 2 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lema Euler:</span>
              <strong style={{ color: '#10B981', fontFamily: 'Fira Code' }}>18 = 2 × 9</strong>
            </div>
          </div>
        </div>

        {/* Después */}
        <div
          style={{
            backgroundColor: hasA_V3 ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface-card)',
            border: hasA_V3 ? '1.5px solid #10B981' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.875rem',
            transition: 'all 0.3s',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: hasA_V3 ? '#10B981' : 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Estado Posterior (Después)</span>
            {hasA_V3 && <span className="badge badge-green" style={{ fontSize: '0.62rem' }}>EN VIVO</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 3 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Grado deg(A):</span>
              <strong style={{ color: '#FFFFFF', fontFamily: 'Fira Code' }}>
                {hasA_V3 ? 'deg(A): 2 → 3' : '2 → 3'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 3 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Grado deg(V3):</span>
              <strong style={{ color: '#FE2C55', fontFamily: 'Fira Code' }}>
                {hasA_V3 ? 'deg(V3): 2 → 3' : '2 → 3'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 3 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Aristas |E|:</span>
              <strong style={{ color: '#FFFFFF', fontFamily: 'Fira Code' }}>
                {hasA_V3 ? '|E|: 9 → 10' : '9 → 10'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 2 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lema Euler:</span>
              <strong style={{ color: '#10B981', fontFamily: 'Fira Code' }}>
                {hasA_V3 ? '20 = 2 × 10' : '20 = 2 × 10'}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
