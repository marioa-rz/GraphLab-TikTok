import React, { useState } from 'react';
import { useGraph } from '../../context/GraphContext';
import { Users, Video, Info } from 'lucide-react';

export default function DegreeTablesPanel() {
  const { degrees, setSelectedNodeId, selectedNodeId } = useGraph();
  const [activeTab, setActiveTab] = useState('all');

  const selectedExplanation =
    selectedNodeId &&
    [...degrees.users, ...degrees.videos].find((node) => node.id === selectedNodeId)?.explanation;

  return (
    <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={20} color="#FE2C55" />
            <span>Cálculo de Grados de los Vértices</span>
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            El grado <code style={{ color: '#FFFFFF' }}>deg(v)</code> cuenta las interacciones directas en cada vértice.
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
            backgroundColor: 'rgba(225, 29, 72, 0.08)',
            border: '1px solid var(--border-red)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <Info size={18} color="#FE2C55" style={{ marginTop: 2, flexShrink: 0 }} />
          <div style={{ fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.4 }}>
            <strong style={{ color: '#FE2C55' }}>Vértice seleccionado ({selectedNodeId}):</strong> {selectedExplanation}
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
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Users size={16} /> Partición U (Usuarios)
              </span>
              <span className="badge badge-white">Suma = {degrees.totalUserDegree}</span>
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
                        backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background-color 0.15s',
                      }}
                      title="Haz clic para resaltar en el lienzo"
                    >
                      <td style={{ padding: '0.625rem 1rem', fontWeight: 700, color: '#FFFFFF' }}>
                        <span style={{ color: '#FFFFFF', marginRight: 6 }}>●</span>
                        {u.name || u.id}
                      </td>
                      <td style={{ padding: '0.625rem 0.75rem', color: 'var(--text-secondary)' }}>
                        {u.neighbors.length > 0 ? (
                          u.neighbors.map((n) => (
                            <span
                              key={n}
                              style={{
                                display: 'inline-block',
                                backgroundColor: 'rgba(225, 29, 72, 0.15)',
                                color: '#FE2C55',
                                padding: '1px 6px',
                                borderRadius: 4,
                                marginRight: 4,
                                fontSize: '0.75rem',
                                fontWeight: 700,
                              }}
                            >
                              {n}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>Ninguno</span>
                        )}
                      </td>
                      <td style={{ padding: '0.625rem 1rem', textAlign: 'right', fontWeight: 900, color: '#FFFFFF' }}>
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
                backgroundColor: 'rgba(225, 29, 72, 0.1)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#FE2C55', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Video size={16} /> Partición V (Videos)
              </span>
              <span className="badge badge-red">Suma = {degrees.totalVideoDegree}</span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem 1rem' }}>Video</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Likes de Usuarios</th>
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
                        backgroundColor: isSelected ? 'rgba(225, 29, 72, 0.15)' : 'transparent',
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background-color 0.15s',
                      }}
                      title="Haz clic para resaltar en el lienzo"
                    >
                      <td style={{ padding: '0.625rem 1rem', fontWeight: 700, color: '#FFFFFF' }}>
                        <span style={{ color: '#FE2C55', marginRight: 6 }}>■</span>
                        {v.id} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>({v.title})</span>
                      </td>
                      <td style={{ padding: '0.625rem 0.75rem', color: 'var(--text-secondary)' }}>
                        {v.neighbors.length > 0 ? (
                          v.neighbors.map((n) => (
                            <span
                              key={n}
                              style={{
                                display: 'inline-block',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: '#FFFFFF',
                                padding: '1px 6px',
                                borderRadius: 4,
                                marginRight: 4,
                                fontSize: '0.75rem',
                                fontWeight: 700,
                              }}
                            >
                              {n}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>Ninguno</span>
                        )}
                      </td>
                      <td style={{ padding: '0.625rem 1rem', textAlign: 'right', fontWeight: 900, color: '#FE2C55' }}>
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
    </div>
  );
}
