import React, { useState } from 'react';
import { useGraph } from '../../context/GraphContext';
import { Heart, ArrowRight, RotateCcw, Check, Zap, Sparkles, TrendingUp, Layers, UserPlus, Video } from 'lucide-react';
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
    loadSampleStarterNetwork,
    resetToOriginal,
  } = useGraph();

  const isOriginalA_V3Model =
    users.some((u) => u.id === 'A') &&
    videos.some((v) => v.id === 'V3') &&
    users.some((u) => u.id === 'B') &&
    videos.some((v) => v.id === 'V1');

  const isEmpty = users.length === 0 || videos.length === 0;

  // Custom simulation states for non-standard / free canvas networks
  const [customUserId, setCustomUserId] = useState('');
  const [customVideoId, setCustomVideoId] = useState('');

  // Fallback to first available nodes if custom selections are empty or invalid
  const activeCustomUserId = users.some((u) => u.id === customUserId)
    ? customUserId
    : users[0]?.id || '';
  const activeCustomVideoId = videos.some((v) => v.id === customVideoId)
    ? customVideoId
    : videos[0]?.id || '';

  const hasCustomEdge = edges.some(
    (e) =>
      (e.source === activeCustomUserId && e.target === activeCustomVideoId) ||
      (e.source === activeCustomVideoId && e.target === activeCustomUserId)
  );

  // Comprobar si la interacción (A, V3) ya existe
  const hasA_V3 = edges.some(
    (e) => (e.source === 'A' && e.target === 'V3') || (e.source === 'V3' && e.target === 'A')
  );

  const [activeStep, setActiveStep] = useState(1);

  const handleSimulateStandard = () => {
    if (hasA_V3) return;
    simulateLike('A', 'V3');
    confetti({
      particleCount: 50,
      spread: 65,
      origin: { y: 0.75 },
      colors: ['#FE2C55', '#FFFFFF', '#10B981'],
    });
  };

  const handleSimulateCustom = () => {
    if (!activeCustomUserId || !activeCustomVideoId || hasCustomEdge) return;
    simulateLike(activeCustomUserId, activeCustomVideoId);
    confetti({
      particleCount: 45,
      spread: 60,
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

  // If the canvas is completely empty (Scenario 6 initial state)
  if (isEmpty) {
    return (
      <div className="card" style={{ padding: '1.25rem', border: '1.5px solid var(--border-red)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
          <Layers size={22} color="#FE2C55" />
          <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF' }}>
            Escenario 6: Lienzo Libre en Blanco
          </h3>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          Tu red personalizada está lista para ser diseñada. Para simular recomendaciones y comprobar el Lema de Euler, agrega usuarios y videos con los botones superiores o carga una plantilla:
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={loadSampleStarterNetwork}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Sparkles size={14} /> <span>Cargar plantilla básica (2U + 3V)</span>
          </button>
          <button
            onClick={resetToOriginal}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <RotateCcw size={14} /> <span>Restaurar red original UMG</span>
          </button>
        </div>
      </div>
    );
  }

  // If in custom or modified network (not standard A/V3)
  if (!isOriginalA_V3Model) {
    const userDeg = degrees.degreesMap.get(activeCustomUserId) || 0;
    const videoDeg = degrees.degreesMap.get(activeCustomVideoId) || 0;

    return (
      <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={20} color="#FE2C55" />
              <span>Simulador de Conexión Personalizada</span>
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Registra una nueva arista y observa el lema de Euler recalcularse en vivo.
            </p>
          </div>
          {edges.length > 0 && (
            <button
              onClick={undoLastAction}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#FE2C55' }}
            >
              <RotateCcw size={12} /> Deshacer
            </button>
          )}
        </div>

        {/* User and Video Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#FFFFFF', fontWeight: 700, marginBottom: 4 }}>
              Usuario (U):
            </label>
            <select
              value={activeCustomUserId}
              onChange={(e) => setCustomUserId(e.target.value)}
              className="select"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name || u.id} ({u.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#FE2C55', fontWeight: 700, marginBottom: 4 }}>
              Video (V):
            </label>
            <select
              value={activeCustomVideoId}
              onChange={(e) => setCustomVideoId(e.target.value)}
              className="select"
            >
              {videos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title || v.id} ({v.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginBottom: '1rem' }}>
          <button
            onClick={handleSimulateCustom}
            disabled={hasCustomEdge || !activeCustomUserId || !activeCustomVideoId}
            className={`btn btn-lg ${hasCustomEdge ? 'btn-secondary' : 'btn-primary'}`}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.95rem' }}
          >
            {hasCustomEdge ? (
              <>
                <Check size={18} color="#10B981" />
                <span>La conexión ({activeCustomUserId} ↔ {activeCustomVideoId}) ya existe</span>
              </>
            ) : (
              <>
                <Zap size={18} fill="white" />
                <span>Registrar «Me gusta»: {activeCustomUserId} → {activeCustomVideoId}</span>
              </>
            )}
          </button>
        </div>

        {/* HUD Euler */}
        <div style={{ backgroundColor: 'var(--bg-surface-card)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Grado actual de {activeCustomUserId}:</span>
            <strong style={{ color: '#FFFFFF', fontFamily: 'Fira Code' }}>{userDeg}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Grado actual de {activeCustomVideoId}:</span>
            <strong style={{ color: '#FE2C55', fontFamily: 'Fira Code' }}>{videoDeg}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: 4 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Lema de Euler actual:</span>
            <strong style={{ color: '#10B981', fontFamily: 'Fira Code' }}>
              ∑ deg({lemma.totalDegree}) = 2 · {lemma.edgeCount} ({lemma.doubleEdges})
            </strong>
          </div>
        </div>
      </div>
    );
  }

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
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
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
          onClick={handleSimulateStandard}
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
