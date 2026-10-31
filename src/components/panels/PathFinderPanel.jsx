import React, { useState, useMemo } from 'react';
import { useGraph } from '../../context/GraphContext';
import { findShortestPath } from '../../math/graphLogic';
import { Route, Play, AlertCircle, ArrowRight } from 'lucide-react';

export default function PathFinderPanel() {
  const { users, videos, edges, setHighlightedPath } = useGraph();

  const allNodes = useMemo(() => {
    return [
      ...users.map((u) => ({ id: u.id, label: `${u.name || u.id} (Usuario)`, type: 'user' })),
      ...videos.map((v) => ({ id: v.id, label: `${v.id}: ${v.title} (Video)`, type: 'video' })),
    ];
  }, [users, videos]);

  const [startId, setStartId] = useState('A');
  const [targetId, setTargetId] = useState('B');
  const [selectedPathIndex, setSelectedPathIndex] = useState(0);

  const activeStartId = allNodes.some((n) => n.id === startId)
    ? startId
    : allNodes[0]?.id || '';
  const activeTargetId = allNodes.some((n) => n.id === targetId)
    ? targetId
    : allNodes[1]?.id || allNodes[0]?.id || '';

  const searchResult = useMemo(() => {
    if (!activeStartId || !activeTargetId) {
      return { found: false, message: 'Se requieren vértices en la red para calcular caminos.' };
    }
    return findShortestPath(activeStartId, activeTargetId, users, videos, edges);
  }, [activeStartId, activeTargetId, users, videos, edges]);

  const handleApplyHighlight = (pathArray) => {
    setHighlightedPath(pathArray);
  };

  if (allNodes.length < 2) {
    return (
      <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
          <Route size={20} color="#FE2C55" />
          <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF' }}>Análisis de Trayectorias (BFS)</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Se requieren al menos 2 vértices (usuarios o videos) en el grafo para calcular trayectorias y caminos mínimos con el algoritmo BFS. Agrega elementos al lienzo con los botones superiores para comenzar.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Route size={20} color="#FE2C55" />
            <span>Análisis de Trayectorias y Caminos Mínimos (BFS)</span>
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Determina la distancia geodésica y los nodos intermediarios usando Búsqueda en Anchura.
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
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#FFFFFF', fontWeight: 700, marginBottom: 4 }}>
            Vértice Origen:
          </label>
          <select
            value={activeStartId}
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
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#FE2C55', fontWeight: 700, marginBottom: 4 }}>
            Vértice Destino:
          </label>
          <select
            value={activeTargetId}
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

      {/* Preset Quick Tests Buttons (if base nodes exist) */}
      {allNodes.some((n) => n.id === 'A') && allNodes.some((n) => n.id === 'B') && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: 4 }}>
            Pruebas del informe:
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
          {allNodes.some((n) => n.id === 'V3') && (
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
          )}
          {allNodes.some((n) => n.id === 'D') && (
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
          )}
        </div>
      )}

      {/* Result Display */}
      {searchResult.found ? (
        <div
          style={{
            backgroundColor: 'rgba(250, 204, 21, 0.08)',
            border: '1px solid rgba(250, 204, 21, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-amber">
                Longitud mínima: {searchResult.length} {searchResult.length === 1 ? 'arista' : 'aristas'}
              </span>
              {searchResult.allShortestPaths.length > 1 && (
                <span className="badge badge-white">
                  {searchResult.allShortestPaths.length} caminos alternativos
                </span>
              )}
            </div>

            <button
              onClick={() => handleApplyHighlight(searchResult.allShortestPaths[selectedPathIndex] || searchResult.path)}
              className="btn btn-sm btn-primary"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              <Play size={12} fill="white" /> Resaltar en Grafo
            </button>
          </div>

          {/* Paths List */}
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
                    backgroundColor: isCurrent ? 'rgba(250, 204, 21, 0.18)' : 'var(--bg-surface)',
                    border: isCurrent ? '1.5px solid #FACC15' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Fira Code', fontSize: '0.9rem' }}>
                    <span style={{ color: '#FACC15', fontWeight: 800 }}>Camino {idx + 1}:</span>
                    {p.map((nodeId, nIdx) => (
                      <React.Fragment key={nIdx}>
                        <span
                          style={{
                            color: nodeId.startsWith('V') ? '#FE2C55' : '#FFFFFF',
                            fontWeight: 800,
                          }}
                        >
                          {nodeId}
                        </span>
                        {nIdx < p.length - 1 && <ArrowRight size={14} color="#64748B" />}
                      </React.Fragment>
                    ))}
                  </div>

                  <span style={{ fontSize: '0.72rem', color: isCurrent ? '#FFFFFF' : 'var(--text-muted)' }}>
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
                <strong style={{ color: '#FACC15' }}>Interpretación académica:</strong> Los usuarios A y B no están unidos directamente (lo que violaría el modelo bipartito), pero tienen <strong>dos caminos de longitud 2</strong> ({' '}
                <code style={{ color: '#FFFFFF' }}>A → V1 → B</code> y <code style={{ color: '#FFFFFF' }}>A → V2 → B</code>). Esto demuestra formalmente que comparten dos intereses en común.
              </p>
            )}
            {startId === 'A' && targetId === 'V3' && (
              <p>
                <strong style={{ color: '#FE2C55' }}>Interpretación académica:</strong> El camino <code style={{ color: '#FFFFFF' }}>A → V1 → B → V3</code> tiene longitud 3. Representa la justificación estructural de la recomendación: A vio V1, B también vio V1 y además vio V3.
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
            <div style={{ fontWeight: 800, color: '#EF4444', fontSize: '0.875rem' }}>
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
