import React, { useState } from 'react';
import { useGraph } from '../../context/GraphContext';
import { User, Video, X, Trash2, Edit2, Link2, Check } from 'lucide-react';

export default function NodeInspectorModal() {
  const {
    selectedNodeId,
    setSelectedNodeId,
    users,
    videos,
    edges,
    degrees,
    removeEdge,
    deleteUser,
    deleteVideo,
    updateUser,
    updateVideo,
    addEdge,
  } = useGraph();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [connectTargetId, setConnectTargetId] = useState('');

  if (!selectedNodeId) return null;

  const user = users.find((u) => u.id === selectedNodeId);
  const video = videos.find((v) => v.id === selectedNodeId);
  const isUser = Boolean(user);
  const node = user || video;

  if (!node) return null;

  const nodeDegreeInfo = isUser
    ? degrees.users.find((u) => u.id === selectedNodeId)
    : degrees.videos.find((v) => v.id === selectedNodeId);

  const connectedEdges = edges.filter(
    (e) => e.source === selectedNodeId || e.target === selectedNodeId
  );

  const candidateConnectNodes = isUser ? videos : users;

  const handleStartEdit = () => {
    if (isUser) {
      setEditName(user.name || user.id);
    } else {
      setEditName(video.title || video.name);
      setEditCategory(video.category || '');
    }
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (isUser) {
      updateUser(user.id, editName);
    } else {
      updateVideo(video.id, editName, editCategory);
    }
    setIsEditing(false);
  };

  const handleDeleteNode = () => {
    if (isUser) {
      deleteUser(user.id);
    } else {
      deleteVideo(video.id);
    }
    setSelectedNodeId(null);
  };

  const handleConnect = () => {
    if (!connectTargetId) return;
    addEdge(selectedNodeId, connectTargetId);
    setConnectTargetId('');
  };

  return (
    <div className="modal-backdrop" onClick={() => setSelectedNodeId(null)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: isUser ? 'rgba(255, 255, 255, 0.08)' : 'rgba(225, 29, 72, 0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isUser ? (
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  color: '#080A0F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  boxShadow: '0 0 12px rgba(255, 255, 255, 0.4)',
                }}
              >
                <User size={20} />
              </div>
            ) : (
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#FE2C55',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  boxShadow: '0 0 12px rgba(254, 44, 85, 0.5)',
                }}
              >
                <Video size={20} />
              </div>
            )}
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8 }}>
                {isUser ? `Usuario ${node.id}` : `Video ${node.id}`}
                <span className={isUser ? 'badge badge-white' : 'badge badge-red'}>
                  Grado: {nodeDegreeInfo?.degree || 0}
                </span>
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {isUser ? node.name : node.title}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedNodeId(null)}
            className="btn btn-ghost btn-sm"
            style={{ borderRadius: '50%', width: 32, height: 32, padding: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.25rem' }}>
          {isEditing ? (
            <div style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  {isUser ? 'Nombre del Usuario:' : 'Título del Video:'}
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input"
                />
              </div>

              {!isUser && (
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Categoría / Temática:
                  </label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="input"
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button onClick={handleSaveEdit} className="btn btn-sm btn-primary">
                  <Check size={14} /> Guardar cambios
                </button>
                <button onClick={() => setIsEditing(false)} className="btn btn-sm btn-ghost">
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: '1.25rem' }}>
              <div
                style={{
                  backgroundColor: 'var(--bg-surface-card)',
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                  lineHeight: 1.45,
                }}
              >
                <strong style={{ color: isUser ? '#FFFFFF' : '#FE2C55' }}>Explicación topológica:</strong>{' '}
                {nodeDegreeInfo?.explanation}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleStartEdit} className="btn btn-secondary btn-sm">
                  <Edit2 size={13} /> Editar información
                </button>
                <button
                  onClick={handleDeleteNode}
                  className="btn btn-ghost btn-sm"
                  style={{ color: '#EF4444' }}
                >
                  <Trash2 size={13} /> Eliminar vértice
                </button>
              </div>
            </div>
          )}

          {/* Connected Edges List */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Link2 size={16} color="#FE2C55" />
              Conexiones existentes ({connectedEdges.length}):
            </h4>

            {connectedEdges.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {connectedEdges.map((edge) => {
                  const otherId = edge.source === selectedNodeId ? edge.target : edge.source;
                  return (
                    <div
                      key={edge.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        backgroundColor: 'var(--bg-surface-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8125rem',
                      }}
                    >
                      <span style={{ color: '#FFFFFF', fontFamily: 'Fira Code' }}>
                        {selectedNodeId} ↔ {otherId}
                      </span>
                      <button
                        onClick={() => removeEdge(edge.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#EF4444', padding: '2px 6px', fontSize: '0.75rem' }}
                      >
                        Desconectar
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Este vértice no posee conexiones registradas actualmente (grado 0).
              </div>
            )}
          </div>

          {/* Quick Connect to another bipartite vertex */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: 8 }}>
              Agregar nueva conexión para {selectedNodeId}:
            </h4>

            <div style={{ display: 'flex', gap: 8 }}>
              <select
                value={connectTargetId}
                onChange={(e) => setConnectTargetId(e.target.value)}
                className="select"
                style={{ flex: 1 }}
              >
                <option value="">Seleccionar {isUser ? 'video' : 'usuario'}...</option>
                {candidateConnectNodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.id}: {n.name || n.title}
                  </option>
                ))}
              </select>
              <button
                onClick={handleConnect}
                disabled={!connectTargetId}
                className="btn btn-primary btn-sm"
              >
                Conectar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
