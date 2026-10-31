import React, { useState, useMemo } from 'react';
import { useGraph } from '../../context/GraphContext';
import { calculateRecommendations } from '../../math/graphLogic';
import { Sparkles, ArrowRight, Play, HelpCircle } from 'lucide-react';

export default function RecommendationPanel() {
  const {
    users,
    videos,
    edges,
    setHighlightedPath,
    setRecommendedNodeId,
    recommendedNodeId,
  } = useGraph();

  const [selectedUserId, setSelectedUserId] = useState('A');
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  const activeUserId = users.some((u) => u.id === selectedUserId)
    ? selectedUserId
    : users[0]?.id || '';

  const recResult = useMemo(() => {
    if (!activeUserId) {
      return {
        targetUserId: '',
        candidates: [],
        hasRecommendations: false,
        message: 'No hay usuarios en la red actual.',
      };
    }
    return calculateRecommendations(activeUserId, users, videos, edges);
  }, [activeUserId, users, videos, edges]);

  const handleApplyRecommendation = (candidate) => {
    setRecommendedNodeId(candidate.video.id);
    if (candidate.justificationPath) {
      setHighlightedPath(candidate.justificationPath);
    }
  };

  if (users.length === 0) {
    return (
      <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
          <Sparkles size={20} color="#FE2C55" />
          <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF' }}>Motor de Recomendación de Contenido</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          No hay usuarios registrados en el grafo actual. Agrega usuarios y videos al lienzo con los botones superiores para que el algoritmo pueda calcular intereses compartidos y trayectorias.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={20} color="#FE2C55" />
            <span>Motor de Recomendación por Intereses Compartidos</span>
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Heurística didáctica basada en trayectorias de longitud 3 a través de vecinos con gustos compartidos.
          </p>
        </div>

        {/* User selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.75rem', color: '#FFFFFF', fontWeight: 700 }}>Usuario objetivo:</span>
          <select
            value={activeUserId}
            onChange={(e) => {
              setSelectedUserId(e.target.value);
              setRecommendedNodeId(null);
              setHighlightedPath([]);
            }}
            className="select"
            style={{ width: 'auto', padding: '4px 10px', fontSize: '0.8125rem' }}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name || u.id} ({u.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target User Status Summary */}
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
            padding: '0.75rem',
          }}
        >
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>
            Videos que ya le gustan a {selectedUserId}
          </div>
          <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {recResult.likedVideos.length > 0 ? (
              recResult.likedVideos.map((vId) => (
                <span key={vId} className="badge badge-red" style={{ fontSize: '0.75rem' }}>
                  {vId}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.8rem', color: '#FACC15', fontStyle: 'italic' }}>
                Ninguno (Cold Start / Usuario en frío)
              </span>
            )}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
          }}
        >
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>
            Usuarios con intereses similares
          </div>
          <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {recResult.sharedUsers && recResult.sharedUsers.length > 0 ? (
              recResult.sharedUsers.map((su) => (
                <span key={su.userId} className="badge badge-white" style={{ fontSize: '0.75rem' }}>
                  {su.userId} ({su.commonCount} video{su.commonCount > 1 ? 's' : ''} en común: {su.commonVideos.join(', ')})
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Sin coincidencias
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations Outcome */}
      {recResult.hasRecommendations ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recResult.candidates.map((cand, index) => {
            const isTop = index === 0;
            const isCurrentlySelected = recommendedNodeId === cand.video.id;

            return (
              <div
                key={cand.video.id}
                style={{
                  backgroundColor: isTop ? 'rgba(225, 29, 72, 0.10)' : 'var(--bg-surface-card)',
                  border: isCurrentlySelected
                    ? '2px solid #10B981'
                    : isTop
                    ? '1.5px solid #FE2C55'
                    : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        backgroundColor: isTop ? '#FE2C55' : '#334155',
                        color: '#FFFFFF',
                        fontWeight: 900,
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      {isTop ? '★ RECOMENDACIÓN TOP' : `#${index + 1}`}
                    </span>
                    <strong style={{ fontSize: '1rem', color: '#FFFFFF' }}>
                      {cand.video.id}: {cand.video.title}
                    </strong>
                    <span className="badge badge-white">Puntuación: {cand.score}</span>
                  </div>

                  <button
                    onClick={() => handleApplyRecommendation(cand)}
                    className={`btn btn-sm ${isCurrentlySelected ? 'btn-success' : 'btn-primary'}`}
                    style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                  >
                    <Play size={12} fill="white" />
                    <span>Recomendar video a {selectedUserId}</span>
                  </button>
                </div>

                {/* Justification trajectory */}
                <div
                  style={{
                    backgroundColor: 'rgba(8, 10, 15, 0.7)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    margin: '8px 0',
                    fontFamily: 'Fira Code',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexWrap: 'wrap',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>
                    Trayectoria justificativa:
                  </span>
                  {cand.justificationPath.map((node, nIdx) => (
                    <React.Fragment key={nIdx}>
                      <span
                        style={{
                          color: node.startsWith('V') ? '#FE2C55' : '#FFFFFF',
                          fontWeight: 800,
                        }}
                      >
                        {node}
                      </span>
                      {nIdx < cand.justificationPath.length - 1 && <ArrowRight size={14} color="#64748B" />}
                    </React.Fragment>
                  ))}
                  <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                    Longitud: {cand.pathLength}
                  </span>
                </div>

                <p style={{ fontSize: '0.8125rem', color: '#CBD5E1', lineHeight: 1.4 }}>
                  {cand.explanation}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontWeight: 800, color: '#FACC15', fontSize: '0.95rem', marginBottom: 4 }}>
            No hay recomendaciones basadas en intereses compartidos
          </div>
          <div style={{ fontSize: '0.8125rem', color: '#CBD5E1', maxWidth: '500px', margin: '0 auto' }}>
            {recResult.message}
          </div>
        </div>
      )}

      {/* Accordion explanation */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '1rem' }}>
        <button
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="btn btn-ghost btn-sm"
          style={{ color: '#FE2C55', padding: '4px 8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <HelpCircle size={14} />
          <span>{showFormulaDetails ? 'Ocultar detalles de la fórmula' : '¿Cómo se calculó la puntuación de similitud?'}</span>
        </button>

        {showFormulaDetails && (
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
            <p style={{ marginBottom: '0.5rem', fontFamily: 'Fira Code', color: '#FFFFFF' }}>
              Puntuación(U, V) = ∑ [para cada U' ≠ U que interactuó con V] |Videos_comunes(U, U')|
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              Para el <strong style={{ color: '#FFFFFF' }}>Usuario A</strong> y el <strong style={{ color: '#FE2C55' }}>Video V3</strong>:
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '0.5rem' }}>
              <li>Usuarios que interactuaron con V3: B y C.</li>
              <li>A y B comparten 2 videos (V1 y V2). Aporte de B: +2 puntos.</li>
              <li>A y C comparten 0 videos. Aporte de C: +0 puntos.</li>
              <li><strong style={{ color: '#10B981' }}>Puntuación total para V3 = 2 + 0 = 2 puntos.</strong></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
