import React, { useState } from 'react';
import { useGraph } from '../../context/GraphContext';
import FlowGraph from '../graph/FlowGraph';
import DegreeTablesPanel from '../panels/DegreeTablesPanel';
import HandshakingLemmaPanel from '../panels/HandshakingLemmaPanel';
import PathFinderPanel from '../panels/PathFinderPanel';
import RecommendationPanel from '../panels/RecommendationPanel';
import NewInteractionSimulator from '../panels/NewInteractionSimulator';
import RepetitiveConsumptionPanel from '../panels/RepetitiveConsumptionPanel';
import {
  Plus,
  RotateCcw,
  Trash2,
  Share2,
  Sparkles,
  Route,
  Calculator,
  Layers,
  Heart,
  UserPlus,
  Video,
  X,
} from 'lucide-react';

export default function InteractiveLabView() {
  const {
    users,
    videos,
    edges,
    addUser,
    addVideo,
    addEdge,
    resetToOriginal,
    clearGraph,
    resetNodeDistribution,
  } = useGraph();

  const [activePanelTab, setActivePanelTab] = useState('recommendations'); // 'recommendations' | 'paths' | 'math' | 'cycles'

  // Modals para agregar usuario o video
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserId, setNewUserId] = useState('');

  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoCategory, setNewVideoCategory] = useState('');
  const [newVideoId, setNewVideoId] = useState('');

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectUser, setConnectUser] = useState('');
  const [connectVideo, setConnectVideo] = useState('');

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (addUser(newUserName, newUserId)) {
      setNewUserName('');
      setNewUserId('');
      setShowAddUserModal(false);
    }
  };

  const handleCreateVideo = (e) => {
    e.preventDefault();
    if (addVideo(newVideoId, newVideoTitle, newVideoCategory)) {
      setNewVideoTitle('');
      setNewVideoCategory('');
      setNewVideoId('');
      setShowAddVideoModal(false);
    }
  };

  const handleCreateEdge = (e) => {
    e.preventDefault();
    if (connectUser && connectVideo) {
      addEdge(connectUser, connectVideo);
      setShowConnectModal(false);
      setConnectUser('');
      setConnectVideo('');
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem 1.25rem' }}>
      {/* Header and Quick Controls Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="badge badge-purple">Laboratorio Abierto</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Experimentación en Tiempo Real
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginTop: 4 }}>
            Laboratorio Interactivo de Grafos y Recomendaciones
          </h2>
        </div>

        {/* Action Buttons Toolbar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="btn btn-secondary btn-sm"
            style={{ color: '#22D3EE' }}
          >
            <UserPlus size={14} /> + Usuario
          </button>

          <button
            onClick={() => setShowAddVideoModal(true)}
            className="btn btn-secondary btn-sm"
            style={{ color: '#F472B6' }}
          >
            <Video size={14} /> + Video
          </button>

          <button
            onClick={() => setShowConnectModal(true)}
            className="btn btn-primary btn-sm"
          >
            <Share2 size={14} /> + Interacción
          </button>

          <button
            onClick={resetToOriginal}
            className="btn btn-ghost btn-sm"
            style={{ color: '#38BDF8' }}
            title="Restaurar el grafo original de 4 usuarios y 5 videos"
          >
            <RotateCcw size={14} /> Base Original
          </button>

          <button
            onClick={clearGraph}
            className="btn btn-ghost btn-sm"
            style={{ color: '#EF4444' }}
            title="Limpiar grafo por completo"
          >
            <Trash2 size={14} /> Limpiar
          </button>
        </div>
      </div>

      {/* Main Grid: Graph Left/Top, Analytical Tabs Right/Bottom */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: '1.5rem',
          alignItems: 'start',
        }}
        className="lab-grid"
      >
        <style>{`
          @media (max-width: 1024px) {
            .lab-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        {/* Left Column: Visualizer */}
        <div>
          <FlowGraph height="640px" interactive={true} />
          <div
            style={{
              marginTop: '0.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              padding: '0 4px',
            }}
          >
            <span>
              💡 Puedes arrastrar un usuario hacia un video para conectarlos, o arrastrar nodos para reorganizar el diseño.
            </span>
            <button
              onClick={resetNodeDistribution}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.7rem', padding: '2px 6px' }}
            >
              Reordenar en columnas
            </button>
          </div>
        </div>

        {/* Right Column: Tabbed Panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Panel Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 4,
              backgroundColor: 'var(--bg-surface)',
              padding: 4,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              overflowX: 'auto',
            }}
          >
            <button
              onClick={() => setActivePanelTab('recommendations')}
              className={`btn btn-sm ${
                activePanelTab === 'recommendations' ? 'btn-primary' : 'btn-ghost'
              }`}
              style={{ padding: '6px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              <Sparkles size={14} /> Recomendaciones
            </button>

            <button
              onClick={() => setActivePanelTab('paths')}
              className={`btn btn-sm ${
                activePanelTab === 'paths' ? 'btn-primary' : 'btn-ghost'
              }`}
              style={{ padding: '6px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              <Route size={14} /> Trayectorias (BFS)
            </button>

            <button
              onClick={() => setActivePanelTab('math')}
              className={`btn btn-sm ${
                activePanelTab === 'math' ? 'btn-primary' : 'btn-ghost'
              }`}
              style={{ padding: '6px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              <Calculator size={14} /> Grados y Lema
            </button>

            <button
              onClick={() => setActivePanelTab('cycles')}
              className={`btn btn-sm ${
                activePanelTab === 'cycles' ? 'btn-primary' : 'btn-ghost'
              }`}
              style={{ padding: '6px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              <Layers size={14} /> Consumo Continuo
            </button>
          </div>

          {/* Tab Content Display */}
          {activePanelTab === 'recommendations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <NewInteractionSimulator />
              <RecommendationPanel />
            </div>
          )}

          {activePanelTab === 'paths' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <PathFinderPanel />
            </div>
          )}

          {activePanelTab === 'math' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <HandshakingLemmaPanel />
              <DegreeTablesPanel />
            </div>
          )}

          {activePanelTab === 'cycles' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <RepetitiveConsumptionPanel />
            </div>
          )}
        </div>
      </div>

      {/* Modal: Crear Usuario */}
      {showAddUserModal && (
        <div className="modal-backdrop" onClick={() => setShowAddUserModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#22D3EE', display: 'flex', alignItems: 'center', gap: 8 }}>
                <UserPlus size={18} /> Crear Nuevo Usuario
              </h3>
              <button onClick={() => setShowAddUserModal(false)} className="btn btn-ghost btn-sm" style={{ padding: 4 }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateUser} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Identificador (ej. E, F, U1):
                </label>
                <input
                  type="text"
                  placeholder={`U${users.length + 1}`}
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value.toUpperCase())}
                  className="input"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Nombre del Usuario:
                </label>
                <input
                  type="text"
                  placeholder="Ej. Usuario E"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="input"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <button type="button" onClick={() => setShowAddUserModal(false)} className="btn btn-ghost btn-sm">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Crear Video */}
      {showAddVideoModal && (
        <div className="modal-backdrop" onClick={() => setShowAddVideoModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#F472B6', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Video size={18} /> Crear Nuevo Video
              </h3>
              <button onClick={() => setShowAddVideoModal(false)} className="btn btn-ghost btn-sm" style={{ padding: 4 }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateVideo} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Identificador (ej. V6, V7):
                </label>
                <input
                  type="text"
                  placeholder={`V${videos.length + 1}`}
                  value={newVideoId}
                  onChange={(e) => setNewVideoId(e.target.value.toUpperCase())}
                  className="input"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Título del Video:
                </label>
                <input
                  type="text"
                  placeholder="Ej. Acuarios y peces tropicales"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Categoría o Temática:
                </label>
                <input
                  type="text"
                  placeholder="Ej. Vida marina"
                  value={newVideoCategory}
                  onChange={(e) => setNewVideoCategory(e.target.value)}
                  className="input"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <button type="button" onClick={() => setShowAddVideoModal(false)} className="btn btn-ghost btn-sm">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-accent btn-sm">
                  Crear Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Agregar Interacción */}
      {showConnectModal && (
        <div className="modal-backdrop" onClick={() => setShowConnectModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Share2 size={18} color="#38BDF8" /> Registrar Interacción Bipartita (U ↔ V)
              </h3>
              <button onClick={() => setShowConnectModal(false)} className="btn btn-ghost btn-sm" style={{ padding: 4 }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateEdge} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#22D3EE', display: 'block', marginBottom: 4, fontWeight: 700 }}>
                  Seleccionar Usuario (Partición U):
                </label>
                <select
                  value={connectUser}
                  onChange={(e) => setConnectUser(e.target.value)}
                  className="select"
                  required
                >
                  <option value="">Selecciona un usuario...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.id} ({u.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#F472B6', display: 'block', marginBottom: 4, fontWeight: 700 }}>
                  Seleccionar Video (Partición V):
                </label>
                <select
                  value={connectVideo}
                  onChange={(e) => setConnectVideo(e.target.value)}
                  className="select"
                  required
                >
                  <option value="">Selecciona un video...</option>
                  {videos.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.id}: {v.title}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                * El sistema verifica automáticamente que no existan aristas duplicadas ni conexiones entre el mismo conjunto.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <button type="button" onClick={() => setShowConnectModal(false)} className="btn btn-ghost btn-sm">
                  Cancelar
                </button>
                <button type="submit" disabled={!connectUser || !connectVideo} className="btn btn-primary btn-sm">
                  Guardar Conexión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
