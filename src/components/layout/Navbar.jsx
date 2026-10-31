import React from 'react';
import { useGraph } from '../../context/GraphContext';
import {
  Share2,
  Sparkles,
  RotateCcw,
  Undo2,
  Layers,
  GraduationCap,
  PlayCircle,
  FlaskConical,
  BookOpen,
  Presentation,
  CheckCircle,
} from 'lucide-react';

export default function Navbar({ activeView, setActiveView, onOpenScenarios }) {
  const { resetToOriginal, undoLastAction, history, currentScenarioId } = useGraph();

  const navItems = [
    { id: 'home', label: 'Inicio', icon: GraduationCap },
    { id: 'guided', label: 'Simulación guiada', icon: PlayCircle },
    { id: 'lab', label: 'Laboratorio', icon: FlaskConical },
    { id: 'theory', label: 'Fundamentos', icon: BookOpen },
    { id: 'presentation', label: 'Modo Exposición', icon: Presentation, isSpecial: true },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(11, 15, 25, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
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
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #0284c7 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(34, 211, 238, 0.4)',
            }}
          >
            <Share2 size={22} color="white" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.2rem', color: '#FFFFFF' }}>
                GraphLab <span style={{ color: '#F472B6' }}>TikTok</span>
              </span>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                UMG
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Matemática Discreta | Ing. Walter Alvarez
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
                      ? 'btn-accent'
                      : 'btn-secondary'
                    : isActive
                    ? 'btn-primary'
                    : 'btn-ghost'
                }`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  ...(item.isSpecial && !isActive
                    ? { border: '1px solid #EC4899', color: '#F472B6' }
                    : {}),
                }}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Global Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
            onClick={onOpenScenarios}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 10px' }}
            title="Explorar escenarios didácticos"
          >
            <Layers size={14} />
            <span style={{ fontSize: '0.75rem' }}>Escenarios</span>
          </button>

          <button
            onClick={resetToOriginal}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px 10px', color: '#38BDF8' }}
            title="Restaurar el grafo original del proyecto UMG"
          >
            <RotateCcw size={14} />
            <span style={{ fontSize: '0.75rem' }}>Restaurar Base</span>
          </button>
        </div>
      </div>
    </header>
  );
}
