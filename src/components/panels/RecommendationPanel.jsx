import React, { useState, useMemo } from 'react';
import { useGraph } from '../../context/GraphContext';
import { calculateRecommendations } from '../../math/graphLogic';
import { Sparkles, ThumbsUp, ArrowRight, UserCheck, Play, HelpCircle, Film } from 'lucide-react';

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

  const recResult = useMemo(() => {
    return calculateRecommendations(selectedUserId, users, videos, edges);
  }, [selectedUserId, users, videos, edges]);

  const handleApplyRecommendation = (candidate) => {
    setRecommendedNodeId(candidate.video.id);
    if (candidate.justificationPath) {
      setHighlightedPath(candidate.justificationPath);
    }
  };

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={20} color="#F472B6" />
            Motor de Recomendación por Intereses Compartidos
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Heurística didáctica basada en trayectorias de longitud 3 a través de vecinos con gustos compartidos.
          </p>
        </div>

        {/* User selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.75rem', color: '#22D3EE', fontWeight: 600 }}>Usuario objetivo:</span>
          <select
            value={selectedUserId}
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
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Videos que ya le gustan a {selectedUserId}
          </div>
          <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {recResult.likedVideos.length > 0 ? (
              recResult.likedVideos.map((vId) => (
                <span key={vId} className="badge badge-pink" style={{ fontSize: '0.75rem' }}>
                  {vId}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.8rem', color: '#F59E0B', fontStyle: 'italic' }}>
                Ninguno (Usuario en frío)
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
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Usuarios con intereses similares
          </div>
          <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {recResult.sharedUsers && recResult.sharedUsers.length > 0 ? (
              recResult.sharedUsers.map((su) => (
                <span key={su.userId} className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
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
                  backgroundColor: isTop ? 'rgba(34, 197, 94, 0.08)' : 'var(--bg-surface-card)',
                  border: isCurrentlySelected
                    ? '2px solid #22C55E'
                    : isTop
                    ? '1px solid rgba(34, 197, 94, 0.35)'
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
                        backgroundColor: isTop ? '#22C55E' : '#334155',
                        color: isTop ? '#0B0F19' : '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      {isTop ? '★ MEJOR RECOMENDACIÓN' : `#${index + 1}`}
                    </span>
                    <strong style={{ fontSize: '1rem', color: '#FFFFFF' }}>
                      {cand.video.id}: {cand.video.title}
                    </strong>
                    <span className="badge badge-purple">Puntuación: {cand.score}</span>
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
                    backgroundColor: 'rgba(11, 15, 25, 0.6)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    margin: '8px 0',
                    fontFamily: 'Fira Code',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600 }}>Trayectoria justificativa:</span>
                  {cand.justificationPath.map((node, nIdx) => (
                    <React.Fragment key={nIdx}>
                      <span
                        style={{
                          color: node.startsWith('V') ? '#F472B6' : '#22D3EE',
                          fontWeight: 700,
                        }}
                      >
                        {node}
                      </span>
                      {nIdx < cand.justificationPath.length - 1 && <ArrowRight size={14} color="#94A3B8" />}
                    </React.Fragment>
                  ))}
                  <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
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
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontWeight: 700, color: '#F59E0B', fontSize: '0.95rem', marginBottom: 4 }}>
            No hay recomendaciones basadas en intereses compartidos
          </div>
          <div style={{ fontSize: '0.8125rem', color: '#CBD5E1', maxWidth: '500px', margin: '0 auto' }}>
            {recResult.message}
          </div>
        </div>
      )}

      {/* Accordion / Formula explanation */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '1rem' }}>
        <button
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="btn btn-ghost btn-sm"
          style={{ color: '#22D3EE', padding: '4px 8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}
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
              Puntuación(U, V) = Σ [para cada U' ≠ U que interactuó con V] |Videos_comunes(U, U')|
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              Para el <strong style={{ color: '#22D3EE' }}>Usuario A</strong> y el <strong style={{ color: '#F472B6' }}>Video V3</strong>:
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '0.5rem' }}>
              <li>Usuarios que le dieron Me gusta a V3: B y C.</li>
              <li>A y B comparten 2 videos en común (V1 y V2). Aporte de B: +2 puntos.</li>
              <li>A y C comparten 0 videos en común. Aporte de C: +0 puntos.</li>
              <li><strong style={{ color: '#22C55E' }}>Puntuación total para V3 = 2 + 0 = 2 puntos.</strong></li>
            </ul>
            <p style={{ fontStyle: 'italic', color: '#94A3B8' }}>
              Esta fórmula es un modelo pedagógico simplificado para ilustrar el uso de caminos de longitud 3 en grafos bipartitos. No reproduce el algoritmo de producción real de TikTok.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
