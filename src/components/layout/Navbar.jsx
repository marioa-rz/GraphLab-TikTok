import React, { useState } from 'react';
import { useGraph } from '../../context/GraphContext';
import {
  Share2,
  RotateCcw,
  Undo2,
  Layers,
  GraduationCap,
  PlayCircle,
  FlaskConical,
  BookOpen,
  Presentation,
  Download,
  Users,
  X,
} from 'lucide-react';
import { academicContext } from '../../data/academicContext';

export default function Navbar({ activeView, setActiveView, onOpenScenarios }) {
  const {
    resetToOriginal,
    undoLastAction,
    history,
    users,
    videos,
    edges,
    exportToJson,
    showToast,
  } = useGraph();

  const [showCreditsModal, setShowCreditsModal] = useState(false);

  const totalVertices = users.length + videos.length;
  const totalEdges = edges.length;

  const navItems = [
    { id: 'home', label: 'Inicio', icon: GraduationCap },
    { id: 'guided', label: 'Simulación guiada', icon: PlayCircle },
    { id: 'lab', label: 'Laboratorio', icon: FlaskConical },
    { id: 'theory', label: 'Fundamentos', icon: BookOpen },
    { id: 'presentation', label: 'Modo Exposición', icon: Presentation, isSpecial: true },
  ];

  const handleExportJson = () => {
    const jsonStr = exportToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `graphlab-tiktok-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Archivo JSON exportado exitosamente.', 'success');
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(8, 10, 15, 0.94)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0.6rem 0.875rem',
        }}
      >
        <div
          style={{
            maxWidth: '1540px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
          }}
        >
          {/* Top Row: Brand & Status & Utility Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              width: '100%',
            }}
          >
            {/* Brand */}
            <div
              onClick={() => setActiveView('home')}
              style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #E11D48 0%, #FE2C55 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 14px rgba(225, 29, 72, 0.55)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                }}
              >
                <Share2 size={18} color="#FFFFFF" strokeWidth={2.5} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.15rem', color: '#FFFFFF' }}>
                    GraphLab <span style={{ color: '#FE2C55' }}>TikTok</span>
                  </span>
                  <span className="badge badge-red" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                    UMG
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }} className="hide-on-mobile">
                  Ingeniería en Sistemas • Ing. Walter Alvarez
                </div>
              </div>
            </div>

            {/* Right utility buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* Status Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '3px 7px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'Fira Code',
                  fontSize: '0.72rem',
                }}
              >
                <span style={{ color: '#FFFFFF' }}>|W|={totalVertices}</span>
                <span style={{ color: 'var(--border-medium)' }}>•</span>
                <span style={{ color: '#FE2C55' }}>|E|={totalEdges}</span>
              </div>

              <button
                onClick={undoLastAction}
                disabled={history.length === 0}
                className="btn btn-secondary btn-sm"
                style={{ padding: '5px 8px' }}
                title="Deshacer"
              >
                <Undo2 size={13} />
                <span className="hide-on-mobile">Deshacer</span>
              </button>

              <button
                onClick={resetToOriginal}
                className="btn btn-ghost btn-sm"
                style={{ padding: '5px 8px', color: '#FE2C55' }}
                title="Restaurar base original"
              >
                <RotateCcw size={13} />
                <span className="hide-on-mobile">Reset</span>
              </button>

              <button
                onClick={handleExportJson}
                className="btn btn-secondary btn-sm hide-on-mobile"
                style={{ padding: '5px 8px' }}
                title="Exportar JSON"
              >
                <Download size={13} />
                <span>JSON</span>
              </button>

              <button
                onClick={() => setShowCreditsModal(true)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '5px 8px', color: '#FFFFFF' }}
                title="Créditos del Equipo"
              >
                <Users size={13} />
                <span className="hide-on-mobile">Equipo</span>
              </button>

              <button
                onClick={onOpenScenarios}
                className="btn btn-primary btn-sm"
                style={{ padding: '5px 10px', fontSize: '0.72rem' }}
                title="Escenarios didácticos"
              >
                <Layers size={13} />
                <span>Escenarios</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Horizontally Scrollable Navigation Tabs for Mobile */}
          <nav className="nav-scroll-container">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`btn btn-sm ${
                    item.isSpecial
                      ? isActive
                        ? 'btn-primary'
                        : 'btn-secondary'
                      : isActive
                      ? 'btn-white'
                      : 'btn-ghost'
                  }`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem',
                    flexShrink: 0,
                    ...(item.isSpecial && !isActive
                      ? { border: '1px solid #FE2C55', color: '#FE2C55' }
                      : {}),
                  }}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Credits Modal */}
      {showCreditsModal && (
        <div className="modal-backdrop" onClick={() => setShowCreditsModal(false)}>
          <div className="modal-card" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                padding: '1.25rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(225, 29, 72, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <GraduationCap size={22} color="#FE2C55" />
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF' }}>Créditos del Proyecto</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {academicContext.university}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreditsModal(false)}
                className="btn btn-ghost btn-sm"
                style={{ borderRadius: '50%', width: 30, height: 30, padding: 0 }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong style={{ color: '#FFFFFF' }}>Tema de investigación:</strong><br />
                «{academicContext.projectTitle}»
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#FE2C55', fontWeight: 800, marginBottom: 6 }}>
                  Equipo de Estudiantes (100% Participación)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {academicContext.authors.map((a) => (
                    <div
                      key={a.id}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: 'var(--bg-surface-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.85rem' }}>{a.name}</span>
                      <span style={{ fontFamily: 'Fira Code', color: '#FE2C55', fontSize: '0.8rem' }}>{a.id}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                Catedrático: <strong style={{ color: '#FFFFFF' }}>{academicContext.professor}</strong> | Sección:{' '}
                <strong style={{ color: '#FE2C55' }}>{academicContext.section}</strong> | Fecha: {academicContext.deliveryDate}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
