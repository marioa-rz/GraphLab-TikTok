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
          backgroundColor: 'rgba(8, 10, 15, 0.92)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            maxWidth: '1540px',
            margin: '0 auto',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Brand & Academic Identity */}
          <div
            onClick={() => setActiveView('home')}
            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #E11D48 0%, #FE2C55 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 18px rgba(225, 29, 72, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              <Share2 size={22} color="#FFFFFF" strokeWidth={2.5} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.25rem', color: '#FFFFFF' }}>
                  GraphLab <span style={{ color: '#FE2C55' }}>TikTok</span>
                </span>
                <span className="badge badge-red" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                  UMG
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Ingeniería en Sistemas | Matemática Discreta • Ing. Walter Alvarez
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-md)',
                    ...(item.isSpecial && !isActive
                      ? { border: '1px solid #FE2C55', color: '#FE2C55' }
                      : {}),
                  }}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action & Graph Status Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Live Graph Status Pills */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '4px 8px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'Fira Code',
                fontSize: '0.75rem',
              }}
            >
              <span style={{ color: '#FFFFFF' }}>|W|={totalVertices}</span>
              <span style={{ color: 'var(--border-strong)' }}>•</span>
              <span style={{ color: '#FE2C55' }}>|E|={totalEdges}</span>
            </div>

            <button
              onClick={undoLastAction}
              disabled={history.length === 0}
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px 10px' }}
              title="Deshacer última acción"
            >
              <Undo2 size={14} />
              <span style={{ fontSize: '0.75rem' }}>Deshacer</span>
            </button>

            <button
              onClick={resetToOriginal}
              className="btn btn-ghost btn-sm"
              style={{ padding: '6px 10px', color: '#FE2C55' }}
              title="Restaurar el grafo original (4 usuarios, 5 videos, 9 aristas)"
            >
              <RotateCcw size={14} />
              <span style={{ fontSize: '0.75rem' }}>Resetear</span>
            </button>

            <button
              onClick={handleExportJson}
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px 10px' }}
              title="Exportar estado actual a JSON"
            >
              <Download size={14} />
              <span style={{ fontSize: '0.75rem' }}>Exportar</span>
            </button>

            <button
              onClick={() => setShowCreditsModal(true)}
              className="btn btn-ghost btn-sm"
              style={{ padding: '6px 10px', color: '#FFFFFF' }}
              title="Ver créditos e integrantes UMG"
            >
              <Users size={14} />
              <span style={{ fontSize: '0.75rem' }}>Equipo</span>
            </button>

            <button
              onClick={onOpenScenarios}
              className="btn btn-primary btn-sm"
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
              title="Explorar escenarios didácticos precargados"
            >
              <Layers size={14} />
              <span>Escenarios</span>
            </button>
          </div>
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
