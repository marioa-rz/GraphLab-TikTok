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
import { Maximize2, LayoutGrid, RotateCcw, Sparkles } from 'lucide-react';

const nodeTypes = {
  user: UserNodeComponent,
  video: VideoNodeComponent,
};

const edgeTypes = {
  custom: CustomEdge,
};

function FlowGraphInner({ height = '620px', interactive = true, showMiniMap = true }) {
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

  // Manejar creación de conexión arrastrando
  const onConnect = useCallback(
    (params) => {
      if (!interactive) return;
      addEdge(params.source, params.target);
    },
    [interactive, addEdge]
  );

  // Manejar arrastre de nodos
  const onNodeDragStop = useCallback(
    (_, node) => {
      updateNodePosition(node.id, node.position);
    },
    [updateNodePosition]
  );

  // Centrar visualización
  const handleFitView = useCallback(() => {
    reactFlowInstance.fitView({ padding: 0.22, duration: 400 });
  }, [reactFlowInstance]);

  // Limpiar selecciones
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
        fitView
        fitViewOptions={{ padding: 0.22 }}
        minZoom={0.3}
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
            nodeColor={(node) => (node.type === 'user' ? '#FFFFFF' : '#E11D48')}
            maskColor="rgba(8, 10, 15, 0.85)"
            style={{
              height: 100,
              width: 140,
              backgroundColor: '#121622',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              bottom: 16,
              right: 16,
            }}
          />
        )}
      </ReactFlow>

      {/* Floating Canvas Controls Top Right */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          display: 'flex',
          gap: 8,
          zIndex: 10,
        }}
      >
        <button
          onClick={handleFitView}
          className="btn btn-secondary btn-sm"
          style={{ backdropFilter: 'blur(10px)', background: 'rgba(18, 22, 34, 0.85)' }}
          title="Centrar y ajustar grafo a la pantalla"
        >
          <Maximize2 size={14} />
          <span>Centrar</span>
        </button>

        <button
          onClick={() => {
            resetNodeDistribution();
            setTimeout(handleFitView, 100);
          }}
          className="btn btn-secondary btn-sm"
          style={{ backdropFilter: 'blur(10px)', background: 'rgba(18, 22, 34, 0.85)' }}
          title="Restaurar alineación bipartita en dos columnas"
        >
          <LayoutGrid size={14} />
          <span>Alinear</span>
        </button>

        <button
          onClick={handleClearSelection}
          className="btn btn-ghost btn-sm"
          style={{
            backdropFilter: 'blur(10px)',
            background: 'rgba(18, 22, 34, 0.85)',
            border: '1px solid var(--border-subtle)',
          }}
          title="Limpiar selecciones y resaltados"
        >
          <RotateCcw size={14} />
          <span>Limpiar</span>
        </button>
      </div>

      {/* Floating Canvas Legend Top Left */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          background: 'rgba(18, 22, 34, 0.90)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontSize: '0.75rem',
          zIndex: 10,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              display: 'inline-block',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
            }}
          />
          <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Usuarios (U)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 14,
              height: 10,
              borderRadius: 3,
              backgroundColor: '#E11D48',
              display: 'inline-block',
              boxShadow: '0 0 10px rgba(225, 29, 72, 0.8)',
            }}
          />
          <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Videos (V)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 18,
              height: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              display: 'inline-block',
            }}
          />
          <span style={{ color: 'var(--text-secondary)' }}>Arista (Like)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 18,
              height: 3,
              backgroundColor: '#FACC15',
              display: 'inline-block',
              boxShadow: '0 0 8px #FACC15',
            }}
          />
          <span style={{ color: '#FACC15', fontWeight: 700 }}>Trayectoria</span>
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
