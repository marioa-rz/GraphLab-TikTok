import React, { useState } from 'react';
import { useGraph } from '../../context/GraphContext';
import { Users, Video, Info, Sparkles, CheckCircle2 } from 'lucide-react';

export default function DegreeTablesPanel() {
  const { degrees, setSelectedNodeId, selectedNodeId, setHighlightedPath } = useGraph();
  const [activeTab, setActiveTab] = useState('all');

  const selectedExplanation =
    selectedNodeId &&
    [...degrees.users, ...degrees.videos].find((node) => node.id === selectedNodeId)?.explanation;

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={20} color="#22D3EE" />
            Cálculo de Grados de los Vértices
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            El grado <code style={{ color: '#38BDF8' }}>deg(v)</code> representa la cantidad de interacciones directas conectadas a cada vértice.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-primary)', padding: 3, borderRadius: 'var(--radius-md)' }}>
          <button
            onClick={() => setActiveTab('all')}
            className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            Todos
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            Usuarios
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`btn btn-sm ${activeTab === 'videos' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            Videos
          </button>
        </div>
      </div>

      {/* Selected Node Quick Context Banner */}
      {selectedExplanation && (
        <div
          style={{
            backgroundColor: 'rgba(34, 211, 238, 0.08)',
            border: '1px solid rgba(34, 211, 238, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <Info size={18} color="#22D3EE" style={{ marginTop: 2, flexShrink: 0 }} />
          <div style={{ fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.4 }}>
            <strong style={{ color: '#22D3EE' }}>Nodo seleccionado ({selectedNodeId}):</strong> {selectedExplanation}
          </div>
        </div>
      )}

      {/* Side-by-side tables grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: activeTab === 'all' ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr',
          gap: '1rem',
        }}
      >
        {/* Users Table */}
        {(activeTab === 'all' || activeTab === 'users') && (
          <div
            style={{
              backgroundColor: 'var(--bg-surface-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(34, 211, 238, 0.08)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#22D3EE', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Users size={16} /> Partición U (Usuarios)
              </span>
              <span className="badge badge-cyan">Suma = {degrees.totalUserDegree}</span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem 1rem' }}>Usuario</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Videos con Me gusta</th>
                  <th style={{ padding: '0.5rem 1rem', textAlign: 'right' }}>Grado</th>
                </tr>
              </thead>
              <tbody>
                {degrees.users.map((u) => {
                  const isSelected = selectedNodeId === u.id;
                  return (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedNodeId(isSelected ? null : u.id)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'rgba(34, 211, 238, 0.15)' : 'transparent',
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background-color 0.15s',
                      }}
                      title="Haz clic para resaltar en el grafo"
                    >
                      <td style={{ padding: '0.625rem 1rem', fontWeight: 600, color: '#FFFFFF' }}>
                        <span style={{ color: '#22D3EE', marginRight: 6 }}>●</span>
                        {u.name || u.id}
                      </td>
                      <td style={{ padding: '0.625rem 0.75rem', color: 'var(--text-secondary)' }}>
                        {u.neighbors.length > 0 ? (
                          u.neighbors.map((n) => (
                            <span
                              key={n}
                              style={{
                                display: 'inline-block',
                                backgroundColor: 'rgba(244, 114, 182, 0.12)',
                                color: '#F472B6',
                                padding: '1px 6px',
                                borderRadius: 4,
                                marginRight: 4,
                                fontSize: '0.75rem',
                              }}
                            >
                              {n}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>Ninguno</span>
                        )}
                      </td>
                      <td style={{ padding: '0.625rem 1rem', textAlign: 'right', fontWeight: 700, color: '#22D3EE' }}>
                        {u.degree}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Videos Table */}
        {(activeTab === 'all' || activeTab === 'videos') && (
          <div
            style={{
              backgroundColor: 'var(--bg-surface-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(244, 114, 182, 0.08)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#F472B6', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Video size={16} /> Partición V (Videos)
              </span>
              <span className="badge badge-pink">Suma = {degrees.totalVideoDegree}</span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem 1rem' }}>Video</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Usuarios que dieron like</th>
                  <th style={{ padding: '0.5rem 1rem', textAlign: 'right' }}>Grado</th>
                </tr>
              </thead>
              <tbody>
                {degrees.videos.map((v) => {
                  const isSelected = selectedNodeId === v.id;
                  return (
                    <tr
                      key={v.id}
                      onClick={() => setSelectedNodeId(isSelected ? null : v.id)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'rgba(244, 114, 182, 0.15)' : 'transparent',
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background-color 0.15s',
                      }}
                      title="Haz clic para resaltar en el grafo"
                    >
                      <td style={{ padding: '0.625rem 1rem', fontWeight: 600, color: '#FFFFFF' }}>
                        <span style={{ color: '#F472B6', marginRight: 6 }}>■</span>
                        {v.id} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>({v.title})</span>
                      </td>
                      <td style={{ padding: '0.625rem 0.75rem', color: 'var(--text-secondary)' }}>
                        {v.neighbors.length > 0 ? (
                          v.neighbors.map((n) => (
                            <span
                              key={n}
                              style={{
                                display: 'inline-block',
                                backgroundColor: 'rgba(34, 211, 238, 0.12)',
                                color: '#22D3EE',
                                padding: '1px 6px',
                                borderRadius: 4,
                                marginRight: 4,
                                fontSize: '0.75rem',
                              }}
                            >
                              {n}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>Ninguno</span>
                        )}
                      </td>
                      <td style={{ padding: '0.625rem 1rem', textAlign: 'right', fontWeight: 700, color: '#F472B6' }}>
                        {v.degree}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Academic Reflection Alert */}
      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8rem',
          color: '#FCD34D',
          lineHeight: 1.45,
        }}
      >
        <strong>Aclaración académica importante:</strong> En teoría de grafos, el grado de un vértice mide únicamente su conectividad estructural directa. Un grado elevado (como el usuario B con grado 3) indica más datos de interacción registrados en el modelo, pero <em>no debe confundirse con influencia social real, calidad de contenido ni propensión a la adicción</em>.
      </div>
    </div>
  );
}
