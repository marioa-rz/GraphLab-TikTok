import React, { useState } from 'react';
import { useGraph } from '../../context/GraphContext';
import { SCENARIOS } from '../../data/scenarios';
import { Layers, Download, Upload, Check, X, AlertCircle, Bookmark, Copy } from 'lucide-react';

export default function ScenarioManagerModal({ isOpen, onClose }) {
  const {
    currentScenarioId,
    loadScenario,
    exportToJson,
    importFromJson,
    showToast,
  } = useGraph();

  const [jsonInput, setJsonInput] = useState('');
  const [activeTab, setActiveTab] = useState('scenarios'); // 'scenarios' | 'json'

  if (!isOpen) return null;

  const handleCopyJson = () => {
    const jsonStr = exportToJson();
    navigator.clipboard.writeText(jsonStr);
    showToast('JSON copiado al portapapeles.', 'success');
  };

  const handleDownloadJson = () => {
    const jsonStr = exportToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `graphlab-tiktok-scenario-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Archivo JSON descargado.', 'success');
  };

  const handleImportSubmit = () => {
    if (!jsonInput.trim()) return;
    const result = importFromJson(jsonInput);
    if (result.success) {
      setJsonInput('');
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 700 }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38BDF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Layers size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF' }}>Gestor de Escenarios y Datos</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Explora casos de estudio didácticos o importa/exporta tus propios grafos.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ borderRadius: '50%', width: 32, height: 32, padding: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 1.25rem' }}>
          <button
            onClick={() => setActiveTab('scenarios')}
            style={{
              padding: '0.75rem 1rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'scenarios' ? '2px solid #22D3EE' : '2px solid transparent',
              color: activeTab === 'scenarios' ? '#22D3EE' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Escenarios Precargados
          </button>
          <button
            onClick={() => setActiveTab('json')}
            style={{
              padding: '0.75rem 1rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'json' ? '2px solid #22D3EE' : '2px solid transparent',
              color: activeTab === 'json' ? '#22D3EE' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Importar / Exportar JSON
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.25rem' }}>
          {activeTab === 'scenarios' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {SCENARIOS.map((scen) => {
                const isActive = currentScenarioId === scen.id;
                return (
                  <div
                    key={scen.id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isActive ? 'rgba(34, 211, 238, 0.08)' : 'var(--bg-surface-card)',
                      border: isActive ? '1px solid #22D3EE' : '1px solid var(--border-subtle)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>
                          {scen.name}
                        </span>
                        <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                          {scen.badge}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          loadScenario(scen.id);
                          onClose();
                        }}
                        className={`btn btn-sm ${isActive ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                      >
                        {isActive ? 'Activo actualmente' : 'Cargar escenario'}
                      </button>
                    </div>

                    <p style={{ fontSize: '0.8125rem', color: '#CBD5E1', marginBottom: 6 }}>
                      {scen.description}
                    </p>

                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', borderTop: '1px dashed var(--border-subtle)', paddingTop: 6 }}>
                      <strong style={{ color: '#FCD34D' }}>Objetivo didáctico:</strong> {scen.learningGoal}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Export Box */}
              <div>
                <h4 style={{ fontSize: '0.875rem', color: '#FFFFFF', marginBottom: 6 }}>
                  Exportar estado actual del grafo:
                </h4>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleCopyJson} className="btn btn-secondary btn-sm">
                    <Copy size={14} /> Copiar JSON
                  </button>
                  <button onClick={handleDownloadJson} className="btn btn-secondary btn-sm">
                    <Download size={14} /> Descargar archivo .json
                  </button>
                </div>
              </div>

              {/* Import Box */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', color: '#FFFFFF', marginBottom: 6 }}>
                  Importar grafo desde JSON:
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                  Pega un objeto JSON con las claves <code>users</code>, <code>videos</code> y <code>edges</code>. El sistema validará automáticamente la propiedad bipartita.
                </p>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder={`{\n  "users": [...],\n  "videos": [...],\n  "edges": [...]\n}`}
                  rows={6}
                  className="input font-mono"
                  style={{ width: '100%', fontSize: '0.75rem', marginBottom: 8 }}
                />
                <button
                  onClick={handleImportSubmit}
                  disabled={!jsonInput.trim()}
                  className="btn btn-primary btn-sm"
                >
                  <Upload size={14} /> Importar y validar grafo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
