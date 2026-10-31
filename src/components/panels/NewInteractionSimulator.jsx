import React, { useState } from 'react';
import { useGraph } from '../../context/GraphContext';
import { Heart, ArrowRight, RotateCcw, Check, Sparkles, PlusCircle } from 'lucide-react';
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
    lastDiff,
  } = useGraph();

  // Comprobar si la interacción (A, V3) ya existe
  const hasA_V3 = edges.some(
    (e) => (e.source === 'A' && e.target === 'V3') || (e.source === 'V3' && e.target === 'A')
  );

  const handleSimulate = () => {
    if (hasA_V3) return;
    simulateLike('A', 'V3');
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.75 },
      colors: ['#22C55E', '#F472B6', '#38BDF8'],
    });
  };

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Heart size={20} color="#EC4899" />
            Simulación de Nueva Interacción: (A, V3)
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Comprueba cómo el grafo evoluciona dinámicamente cuando un usuario acepta una recomendación.
          </p>
        </div>

        {hasA_V3 && (
          <button
            onClick={undoLastAction}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            title="Revertir la interacción para volver a experimentar"
          >
            <RotateCcw size={12} /> Deshacer Me gusta
          </button>
        )}
      </div>

      {/* Action Button */}
      <div style={{ marginBottom: '1.25rem' }}>
        <button
          onClick={handleSimulate}
          disabled={hasA_V3}
          className={`btn btn-lg ${hasA_V3 ? 'btn-secondary' : 'btn-accent'}`}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '0.875rem 1.25rem',
            fontSize: '1rem',
          }}
        >
          {hasA_V3 ? (
            <>
              <Check size={20} color="#22C55E" strokeWidth={3} />
              <span>Interacción (A, V3) ya registrada en el grafo</span>
            </>
          ) : (
            <>
              <Heart size={20} fill="white" />
              <span>Simular que A le da «Me gusta» a V3</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Comparator "Antes / Después" */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        {/* Estado Antes */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>
            Estado Inicial (Antes)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Grado de A:</span>
              <strong style={{ color: '#22D3EE', fontFamily: 'Fira Code' }}>deg(A) = 2</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Grado de V3:</span>
              <strong style={{ color: '#F472B6', fontFamily: 'Fira Code' }}>deg(V3) = 2</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Número de aristas:</span>
              <strong style={{ color: '#FFFFFF', fontFamily: 'Fira Code' }}>|E| = 9</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Suma total de grados:</span>
              <strong style={{ color: '#A855F7', fontFamily: 'Fira Code' }}>Σ deg(v) = 18</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 2 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lema del apretón:</span>
              <strong style={{ color: '#22C55E', fontFamily: 'Fira Code' }}>18 = 2 × 9</strong>
            </div>
          </div>
        </div>

        {/* Estado Después */}
        <div
          style={{
            backgroundColor: hasA_V3 ? 'rgba(34, 197, 94, 0.08)' : 'var(--bg-surface-card)',
            border: hasA_V3 ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            transition: 'all 0.3s',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: hasA_V3 ? '#22C55E' : 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Estado Posterior (Después)</span>
            {hasA_V3 && <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>ACTUALIZADO</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Grado de A:</span>
              <strong style={{ color: '#22D3EE', fontFamily: 'Fira Code' }}>
                {hasA_V3 ? 'deg(A) = 3 (↑ +1)' : '2 → 3'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Grado de V3:</span>
              <strong style={{ color: '#F472B6', fontFamily: 'Fira Code' }}>
                {hasA_V3 ? 'deg(V3) = 3 (↑ +1)' : '2 → 3'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Número de aristas:</span>
              <strong style={{ color: '#FFFFFF', fontFamily: 'Fira Code' }}>
                {hasA_V3 ? '|E| = 10 (↑ +1)' : '9 → 10'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Suma total de grados:</span>
              <strong style={{ color: '#A855F7', fontFamily: 'Fira Code' }}>
                {hasA_V3 ? 'Σ deg(v) = 20 (↑ +2)' : '18 → 20'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 2 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lema del apretón:</span>
              <strong style={{ color: '#22C55E', fontFamily: 'Fira Code' }}>
                {hasA_V3 ? '20 = 2 × 10' : '20 = 2 × 10'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Banner */}
      <div
        style={{
          padding: '0.875rem 1rem',
          backgroundColor: 'rgba(34, 211, 238, 0.08)',
          border: '1px solid rgba(34, 211, 238, 0.25)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8125rem',
          color: '#E2E8F0',
          lineHeight: 1.5,
        }}
      >
        <strong style={{ color: '#22D3EE' }}>Conclusión pedagógica:</strong> Una nueva interacción modifica la estructura del grafo, incrementando exactamente en 1 el grado de los dos vértices participantes (el usuario y el video) y sumando 2 a la suma total de grados, preservando la validez matemática del lema del apretón de manos (<code style={{ color: '#22C55E' }}>20 = 2 × 10</code>). Esto suministra nueva información topológica para generar recomendaciones posteriores.
      </div>
    </div>
  );
}
