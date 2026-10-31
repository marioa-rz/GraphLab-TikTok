import React, { useState } from 'react';
import { useGraph } from '../../context/GraphContext';
import { Calculator, CheckCircle2, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HandshakingLemmaPanel() {
  const { lemma, users, videos, edges } = useGraph();
  const [showProofDetails, setShowProofDetails] = useState(false);

  const handleCelebrate = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FE2C55', '#FFFFFF', '#10B981'],
    });
  };

  return (
    <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calculator size={20} color="#FE2C55" />
            <span>Monitor del Lema del Apretón de Manos (Euler)</span>
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Comprobación topológica: la suma total de grados duplica estrictamente las aristas.
          </p>
        </div>

        <button
          onClick={handleCelebrate}
          className="btn btn-sm btn-primary"
          style={{ padding: '5px 12px' }}
          title="Verificar validez del teorema"
        >
          <Sparkles size={14} />
          <span>Verificar</span>
        </button>
      </div>

      {/* Main HUD Formula Card */}
      <div
        style={{
          background: lemma.isSatisfied
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(18, 22, 34, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(225, 29, 72, 0.15) 0%, rgba(18, 22, 34, 0.95) 100%)',
          border: `1px solid ${lemma.isSatisfied ? 'rgba(16, 185, 129, 0.45)' : '#FE2C55'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          marginBottom: '1.25rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#FE2C55', fontWeight: 800, letterSpacing: '0.06em' }}>
              FÓRMULA FUNDAMENTAL DE GRAFOS NO DIRIGIDOS
            </div>
            <div style={{ fontFamily: 'Fira Code', fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', margin: '4px 0' }}>
              ∑ deg(v) = 2 · |E|
            </div>
            <div style={{ fontFamily: 'Fira Code', fontSize: '1.05rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>[{lemma.totalUserDegree} (Usuarios) + {lemma.totalVideoDegree} (Videos) = {lemma.totalDegree}]</span>
              <span style={{ color: '#FFFFFF' }}>==</span>
              <span>[2 · {lemma.edgeCount} = {lemma.doubleEdges}]</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {lemma.isSatisfied ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  border: '1.5px solid #10B981',
                  color: '#10B981',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  boxShadow: '0 0 15px rgba(16, 185, 129, 0.35)',
                }}
              >
                <CheckCircle2 size={18} />
                <span>✓ TEOREMA VÁLIDO</span>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  border: '1.5px solid #EF4444',
                  color: '#EF4444',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                }}
              >
                <AlertCircle size={18} />
                <span>INCONSISTENCIA</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step by Step HUD Counter Breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.875rem',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: '#FFFFFF', fontWeight: 800, marginBottom: 4 }}>
            1. Grados de Usuarios (U)
          </div>
          <div style={{ fontFamily: 'Fira Code', fontSize: '0.85rem', color: '#FFFFFF', marginBottom: 2 }}>
            {lemma.userSumText}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Total conexiones emitidas ({lemma.totalUserDegree}).
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.875rem',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: '#FE2C55', fontWeight: 800, marginBottom: 4 }}>
            2. Grados de Videos (V)
          </div>
          <div style={{ fontFamily: 'Fira Code', fontSize: '0.85rem', color: '#FE2C55', marginBottom: 2 }}>
            {lemma.videoSumText}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Total «Me gusta» recibidos ({lemma.totalVideoDegree}).
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.875rem',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: '#FACC15', fontWeight: 800, marginBottom: 4 }}>
            3. Suma Total ∑ deg(v)
          </div>
          <div style={{ fontFamily: 'Fira Code', fontSize: '0.85rem', color: '#FACC15', marginBottom: 2 }}>
            {lemma.totalSumText}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Total de extremos contados.
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.875rem',
          }}
        >
          <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 800, marginBottom: 4 }}>
            4. Doble de Aristas (2 · |E|)
          </div>
          <div style={{ fontFamily: 'Fira Code', fontSize: '0.85rem', color: '#10B981', marginBottom: 2 }}>
            2 · {lemma.edgeCount} = {lemma.doubleEdges}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Cada arista cuenta dos veces.
          </div>
        </div>
      </div>

      {/* Accordion Explanation */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
        <button
          onClick={() => setShowProofDetails(!showProofDetails)}
          className="btn btn-ghost btn-sm"
          style={{ color: '#FE2C55', padding: '4px 8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <HelpCircle size={14} />
          <span>{showProofDetails ? 'Ocultar deducción matemática' : '¿Por qué se cumple siempre este teorema?'}</span>
        </button>

        {showProofDetails && (
          <div
            style={{
              marginTop: '0.75rem',
              padding: '1rem',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            <p style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: '#FFFFFF' }}>En palabras simples:</strong> Imagina una sala donde varias personas se saludan con un apretón de manos. Cada saludo es una única acción física (una arista), pero involucra dos manos distintas.
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              Por tanto, si en total ocurrieron <strong style={{ color: '#10B981' }}>{lemma.edgeCount} apretones</strong>, las manos involucradas suman exactamente el doble: <strong style={{ color: '#10B981' }}>{lemma.doubleEdges} manos</strong>.
            </p>
            <p>
              En el modelo bipartito, como toda arista une estrictamente a un usuario con un video, la suma de grados de los usuarios siempre equivale a |E| ({lemma.totalUserDegree}) y la de los videos también equivale a |E| ({lemma.totalVideoDegree}).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
