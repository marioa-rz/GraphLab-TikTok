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
      colors: ['#22C55E', '#22D3EE', '#F472B6'],
    });
  };

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calculator size={20} color="#22C55E" />
            Lema del Apretón de Manos (Handshaking Lemma)
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Teorema fundamental: En todo grafo no dirigido, la suma de los grados de todos los vértices es igual al doble del número de aristas.
          </p>
        </div>

        <button
          onClick={handleCelebrate}
          className="btn btn-sm btn-success"
          style={{ padding: '5px 12px' }}
          title="Verificar y celebrar teorema"
        >
          <Sparkles size={14} />
          <span>Verificar</span>
        </button>
      </div>

      {/* Main Formula Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(21, 27, 43, 0.9) 100%)',
          border: '1px solid rgba(34, 197, 94, 0.35)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#22C55E', fontWeight: 800, letterSpacing: '0.05em' }}>
              Teorema de Euler / Lema del Apretón de Manos
            </div>
            <div style={{ fontFamily: 'Fira Code', fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', margin: '4px 0' }}>
              Σ deg(v) = 2 · |E|
            </div>
            <div style={{ fontFamily: 'Fira Code', fontSize: '1.1rem', color: '#86EFAC' }}>
              {lemma.totalDegree} = 2 · {lemma.edgeCount} ({lemma.totalDegree} = {lemma.doubleEdges})
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {lemma.isSatisfied ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid #22C55E',
                  color: '#22C55E',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              >
                <CheckCircle2 size={18} />
                <span>IGUALDAD COMPROBADA</span>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid #EF4444',
                  color: '#EF4444',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              >
                <AlertCircle size={18} />
                <span>INCONSISTENCIA EN EL GRAFO</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step by Step Breakdown Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
          <div style={{ fontSize: '0.75rem', color: '#22D3EE', fontWeight: 700, marginBottom: 4 }}>
            1. Grados de Usuarios (U)
          </div>
          <div style={{ fontFamily: 'Fira Code', fontSize: '0.85rem', color: '#E2E8F0', marginBottom: 2 }}>
            {lemma.userSumText}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Total de conexiones emitidas por los usuarios.
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
          <div style={{ fontSize: '0.75rem', color: '#F472B6', fontWeight: 700, marginBottom: 4 }}>
            2. Grados de Videos (V)
          </div>
          <div style={{ fontFamily: 'Fira Code', fontSize: '0.85rem', color: '#E2E8F0', marginBottom: 2 }}>
            {lemma.videoSumText}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Total de «Me gusta» recibidos por los videos.
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
          <div style={{ fontSize: '0.75rem', color: '#A855F7', fontWeight: 700, marginBottom: 4 }}>
            3. Suma Total de Grados
          </div>
          <div style={{ fontFamily: 'Fira Code', fontSize: '0.85rem', color: '#E2E8F0', marginBottom: 2 }}>
            {lemma.totalSumText}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Σ deg(u) + Σ deg(v) = {lemma.totalDegree}
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
          <div style={{ fontSize: '0.75rem', color: '#22C55E', fontWeight: 700, marginBottom: 4 }}>
            4. Doble de Aristas (2 · |E|)
          </div>
          <div style={{ fontFamily: 'Fira Code', fontSize: '0.85rem', color: '#E2E8F0', marginBottom: 2 }}>
            2 · {lemma.edgeCount} = {lemma.doubleEdges}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Cada arista cuenta en dos extremos.
          </div>
        </div>
      </div>

      {/* Accordion / Details toggle */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
        <button
          onClick={() => setShowProofDetails(!showProofDetails)}
          className="btn btn-ghost btn-sm"
          style={{ color: '#22D3EE', padding: '4px 8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <HelpCircle size={14} />
          <span>{showProofDetails ? 'Ocultar explicación formal' : '¿Por qué ocurre esto? Explicación en palabras simples'}</span>
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
              <strong style={{ color: '#FFFFFF' }}>En palabras sencillas:</strong> Imagine una fiesta donde dos personas se saludan dándose la mano. Ese saludo es una única acción (una arista), pero involucra dos manos (una por cada persona).
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              Si en la sala ocurrieron <strong style={{ color: '#22C55E' }}>{lemma.edgeCount} apretones de manos</strong>, la suma de las manos que participaron debe ser exactamente el doble: <strong style={{ color: '#22C55E' }}>{lemma.doubleEdges} manos</strong>.
            </p>
            <p>
              En nuestro modelo bipartito, además ocurre una propiedad elegante: cada arista une obligatoriamente un usuario con un video, por lo que la suma de grados de los usuarios ({lemma.totalUserDegree}) es exactamente igual al número de aristas (|E| = {lemma.edgeCount}), y la suma de grados de los videos ({lemma.totalVideoDegree}) también es igual a |E|.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
