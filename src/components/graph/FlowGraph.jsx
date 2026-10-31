import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import UserNodeComponent from './UserNode';
import VideoNodeComponent from './VideoNode';
import CustomEdge from './CustomEdge';
import { useGraph } from '../../context/GraphContext';
import { Maximize2, LayoutGrid, RotateCcw, Layers, Sparkles } from 'lucide-react';

const nodeTypes = {
  user: UserNodeComponent,
  video: VideoNodeComponent,
};

const edgeTypes = {
  custom: CustomEdge,
};

function FlowGraphInner({ height = 'clamp(440px, 62vh, 620px)', interactive = true, showMiniMap = true }) {
  const {
    users,
    videos,
    edges,
    addEdge,
    updateNodePosition,
    resetNodeDistribution,
    setHighlightedPath,
    setRecommendedNodeId,
    setSelectedNodeId,
    setSelectedEdgeId,
    openNodeInspector,
    loadSampleStarterNetwork,
    resetToOriginal,
  } = useGraph();

  const reactFlowInstance = useReactFlow();

  // Convertir users y videos al formato de React Flow
  const flowNodes = useMemo(() => {
    const userNodes = users.map((u) => ({
      id: u.id,
      type: 'user',
      position: u.position || { x: 100, y: 100 },
      data: { name: u.name, id: u.id },
      draggable: interactive,
    }));

    const videoNodes = videos.map((v) => ({
      id: v.id,
      type: 'video',
      position: v.position || { x: 500, y: 100 },
      data: { name: v.name, title: v.title, category: v.category, id: v.id },
      draggable: interactive,
    }));

    return [...userNodes, ...videoNodes];
  }, [users, videos, interactive]);

  // Convertir aristas al formato de React Flow
  const flowEdges = useMemo(() => {
    return edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'custom',
      data: { isNew: e.isNew, isInitial: e.isInitial },
    }));
  }, [edges]);

  const onConnect = useCallback(
    (params) => {
      if (!interactive) return;
      addEdge(params.source, params.target);
    },
    [interactive, addEdge]
  );

  const onNodeDragStop = useCallback(
    (_, node) => {
      updateNodePosition(node.id, node.position);
    },
    [updateNodePosition]
  );

  const handleFitView = useCallback(() => {
    reactFlowInstance.fitView({ padding: 0.22, duration: 400 });
  }, [reactFlowInstance]);

  const handleClearSelection = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setHighlightedPath([]);
    setRecommendedNodeId(null);
  }, [setSelectedNodeId, setSelectedEdgeId, setHighlightedPath, setRecommendedNodeId]);

  return (
    <div
      style={{
        width: '100%',
        height,
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border-medium)',
        backgroundColor: '#090C12',
        boxShadow: 'var(--shadow-glass)',
      }}
    >
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeDoubleClick={(_, node) => openNodeInspector(node.id)}
        fitView
        fitViewOptions={{ padding: 0.22 }}
        minZoom={0.25}
        maxZoom={2.2}
        proOptions={{ hideAttribution: true }}
        onPaneClick={handleClearSelection}
      >
        <Background color="rgba(255, 255, 255, 0.05)" gap={22} size={1.2} />
        <Controls
          showInteractive={false}
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
          }}
        />
        {showMiniMap && (
          <MiniMap
            className="flow-minimap"
            nodeColor={(node) => (node.type === 'user' ? '#FFFFFF' : '#E11D48')}
            maskColor="rgba(8, 10, 15, 0.85)"
            style={{
              height: 95,
              width: 130,
              backgroundColor: '#121622',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              bottom: 14,
              right: 14,
            }}
          />
        )}
      </ReactFlow>

      {/* Empty State Overlay for Free Canvas / Scenario 6 */}
      {flowNodes.length === 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15,
            backgroundColor: 'rgba(9, 12, 18, 0.88)',
            backdropFilter: 'blur(8px)',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              maxWidth: 480,
              padding: '2rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-red)',
              boxShadow: 'var(--shadow-glass)',
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                backgroundColor: 'rgba(254, 44, 85, 0.15)',
                color: '#FE2C55',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
                border: '1px solid var(--border-red)',
              }}
            >
              <Layers size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: 6 }}>
              Lienzo Libre en Blanco
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              El grafo está listo para que crees tu propia red bipartita. Usa los botones <strong>+ Usuario</strong> y <strong>+ Video</strong> de la barra superior, o carga una plantilla inicial:
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={loadSampleStarterNetwork}
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px' }}
              >
                <Sparkles size={14} /> <span>Cargar plantilla inicial (2U + 3V)</span>
              </button>
              <button
                onClick={resetToOriginal}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px' }}
              >
                <RotateCcw size={14} /> <span>Restaurar red original (UMG)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Canvas Controls Top Right */}
      <div
        className="flow-controls-bar"
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'flex',
          gap: 6,
          zIndex: 10,
        }}
      >
        <button
          onClick={handleFitView}
          className="btn btn-secondary btn-sm"
          style={{ backdropFilter: 'blur(10px)', background: 'rgba(18, 22, 34, 0.88)' }}
          title="Centrar y ajustar grafo a la pantalla"
        >
          <Maximize2 size={13} />
          <span className="hide-on-mobile">Centrar</span>
        </button>

        <button
          onClick={() => {
            resetNodeDistribution();
            setTimeout(handleFitView, 100);
          }}
          className="btn btn-secondary btn-sm"
          style={{ backdropFilter: 'blur(10px)', background: 'rgba(18, 22, 34, 0.88)' }}
          title="Restaurar alineación bipartita"
        >
          <LayoutGrid size={13} />
          <span className="hide-on-mobile">Alinear</span>
        </button>

        <button
          onClick={handleClearSelection}
          className="btn btn-ghost btn-sm"
          style={{
            backdropFilter: 'blur(10px)',
            background: 'rgba(18, 22, 34, 0.88)',
            border: '1px solid var(--border-subtle)',
          }}
          title="Limpiar selecciones"
        >
          <RotateCcw size={13} />
          <span className="hide-on-mobile">Limpiar</span>
        </button>
      </div>

      {/* Floating Canvas Legend */}
      <div
        className="flow-legend"
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          background: 'rgba(18, 22, 34, 0.92)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: '0.72rem',
          zIndex: 10,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              display: 'inline-block',
              boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
            }}
          />
          <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Usuarios (U)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span
            style={{
              width: 12,
              height: 9,
              borderRadius: 2,
              backgroundColor: '#E11D48',
              display: 'inline-block',
              boxShadow: '0 0 8px rgba(225, 29, 72, 0.8)',
            }}
          />
          <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Videos (V)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span
            style={{
              width: 14,
              height: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              display: 'inline-block',
            }}
          />
          <span style={{ color: 'var(--text-secondary)' }}>Like</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span
            style={{
              width: 14,
              height: 3,
              backgroundColor: '#FACC15',
              display: 'inline-block',
              boxShadow: '0 0 6px #FACC15',
            }}
          />
          <span style={{ color: '#FACC15', fontWeight: 700 }}>Camino</span>
        </div>
      </div>
    </div>
  );
}

export default function FlowGraph(props) {
  return (
    <ReactFlowProvider>
      <FlowGraphInner {...props} />
    </ReactFlowProvider>
  );
}
