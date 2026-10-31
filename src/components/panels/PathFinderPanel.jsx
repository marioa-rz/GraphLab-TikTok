import React, { useState, useMemo } from 'react';
import { useGraph } from '../../context/GraphContext';
import { findShortestPath } from '../../math/graphLogic';
import { Route, Play, Check, AlertCircle, ArrowRight, CornerDownRight } from 'lucide-react';

export default function PathFinderPanel() {
  const { users, videos, edges, setHighlightedPath, highlightedPath } = useGraph();

  const allNodes = useMemo(() => {
    return [
      ...users.map((u) => ({ id: u.id, label: `${u.name || u.id} (Usuario)`, type: 'user' })),
      ...videos.map((v) => ({ id: v.id, label: `${v.id}: ${v.title} (Video)`, type: 'video' })),
    ];
  }, [users, videos]);

  const [startId, setStartId] = useState('A');
  const [targetId, setTargetId] = useState('B');
  const [selectedPathIndex, setSelectedPathIndex] = useState(0);

  const searchResult = useMemo(() => {
    return findShortestPath(startId, targetId, users, videos, edges);
  }, [startId, targetId, users, videos, edges]);

  const handleApplyHighlight = (pathArray) => {
    setHighlightedPath(pathArray);
  };

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Route size={20} color="#A855F7" />
            Análisis de Trayectorias y Caminos Mínimos (BFS)
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Determina la distancia geodésica y las conexiones intermedias utilizando Búsqueda en Anchura.
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#22D3EE', fontWeight: 600, marginBottom: 4 }}>
            Vértice Origen:
          </label>
          <select
            value={startId}
            onChange={(e) => {
              setStartId(e.target.value);
              setSelectedPathIndex(0);
            }}
            className="select"
          >
            {allNodes.map((n) => (
              <option key={`start-${n.id}`} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#F472B6', fontWeight: 600, marginBottom: 4 }}>
            Vértice Destino:
          </label>
          <select
            value={targetId}
            onChange={(e) => {
              setTargetId(e.target.value);
              setSelectedPathIndex(0);
            }}
            className="select"
          >
            {allNodes.map((n) => (
              <option key={`target-${n.id}`} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preset Quick Tests Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: 4 }}>
          Pruebas rápidas:
        </span>
        <button
          onClick={() => {
            setStartId('A');
            setTargetId('B');
            setSelectedPathIndex(0);
          }}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', padding: '3px 8px' }}
        >
          A → B (Interés común)
        </button>
        <button
          onClick={() => {
            setStartId('A');
            setTargetId('V3');
            setSelectedPathIndex(0);
          }}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', padding: '3px 8px' }}
        >
          A → V3 (Recomendación)
        </button>
        <button
          onClick={() => {
            setStartId('A');
            setTargetId('D');
            setSelectedPathIndex(0);
          }}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', padding: '3px 8px' }}
        >
          A → D (Distancia 4)
        </button>
      </div>

      {/* Result Display */}
      {searchResult.found ? (
        <div
          style={{
            backgroundColor: 'rgba(168, 85, 247, 0.08)',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-purple">
                Longitud mínima: {searchResult.length} {searchResult.length === 1 ? 'arista' : 'aristas'}
              </span>
              {searchResult.allShortestPaths.length > 1 && (
                <span className="badge badge-amber">
                  {searchResult.allShortestPaths.length} caminos alternativos de igual longitud
                </span>
              )}
            </div>

            <button
              onClick={() => handleApplyHighlight(searchResult.allShortestPaths[selectedPathIndex] || searchResult.path)}
              className="btn btn-sm btn-accent"
              style={{
                background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
                padding: '4px 10px',
                fontSize: '0.75rem',
              }}
            >
              <Play size={12} fill="white" /> Resaltar en Grafo
            </button>
          </div>

          {/* Paths List if multiple shortest paths exist (like A -> V1 -> B and A -> V2 -> B) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '0.75rem' }}>
            {searchResult.allShortestPaths.map((p, idx) => {
              const isCurrent = idx === selectedPathIndex;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedPathIndex(idx);
                    handleApplyHighlight(p);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isCurrent ? 'rgba(168, 85, 247, 0.2)' : 'var(--bg-surface)',
                    border: isCurrent ? '1px solid #A855F7' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Fira Code', fontSize: '0.9rem' }}>
                    <span style={{ color: '#A855F7', fontWeight: 700 }}>Camino {idx + 1}:</span>
                    {p.map((nodeId, nIdx) => (
                      <React.Fragment key={nIdx}>
                        <span
                          style={{
                            color: nodeId.startsWith('V') ? '#F472B6' : '#22D3EE',
                            fontWeight: 700,
                          }}
                        >
                          {nodeId}
                        </span>
                        {nIdx < p.length - 1 && <ArrowRight size={14} color="#94A3B8" />}
                      </React.Fragment>
                    ))}
                  </div>

                  <span style={{ fontSize: '0.75rem', color: isCurrent ? '#E2E8F0' : 'var(--text-muted)' }}>
                    {isCurrent ? 'Activo en el lienzo' : 'Clic para ver'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pedagogical Explanation */}
          <div style={{ fontSize: '0.8125rem', color: '#E2E8F0', lineHeight: 1.45 }}>
            {startId === 'A' && targetId === 'B' && (
              <p>
                <strong style={{ color: '#A855F7' }}>Interpretación académica:</strong> Los usuarios A y B no están unidos directamente (lo que violaría el modelo bipartito), pero tienen <strong>dos caminos de longitud 2</strong> ({' '}
                <code style={{ color: '#38BDF8' }}>A → V1 → B</code> y <code style={{ color: '#38BDF8' }}>A → V2 → B</code>). Esto demuestra matemáticamente que comparten exactamente dos intereses en común, habilitando la base para las recomendaciones.
              </p>
            )}
            {startId === 'A' && targetId === 'V3' && (
              <p>
                <strong style={{ color: '#A855F7' }}>Interpretación académica:</strong> El camino <code style={{ color: '#38BDF8' }}>A → V1 → B → V3</code> tiene longitud 3. Representa la justificación estructural de la recomendación: A vio V1, B también vio V1 y además vio V3.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <AlertCircle size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 700, color: '#EF4444', fontSize: '0.875rem' }}>
              No existe trayectoria disponible
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#CBD5E1', marginTop: 2 }}>
              {searchResult.message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
