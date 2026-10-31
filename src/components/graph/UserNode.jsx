import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { User } from 'lucide-react';
import { useGraph } from '../../context/GraphContext';

function UserNodeComponent({ id, data, selected }) {
  const {
    nodeDegreesMap,
    hoveredNodeId,
    selectedNodeId,
    activeConnectedNodeIds,
    highlightedPath,
    setHoveredNodeId,
    setSelectedNodeId,
  } = useGraph();

  const degree = nodeDegreesMap.get(id) || 0;
  const isHovered = hoveredNodeId === id;
  const isSelected = selectedNodeId === id || selected;
  const isInActiveNeighborhood = activeConnectedNodeIds.has(id);
  const isInPath = highlightedPath.includes(id);

  // Dimming logic: if something is hovered/selected/in-path, dim nodes that aren't related
  const hasGlobalFocus =
    (hoveredNodeId && hoveredNodeId !== id) ||
    (selectedNodeId && selectedNodeId !== id) ||
    highlightedPath.length > 0;
  const isDimmed = hasGlobalFocus && !isInActiveNeighborhood && !isInPath;

  const nodeClasses = [
    'node-user',
    (isHovered || isSelected) && 'highlighted',
    isInPath && 'path-highlighted',
    isDimmed && 'dimmed',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={nodeClasses}
      onMouseEnter={() => setHoveredNodeId(id)}
      onMouseLeave={() => setHoveredNodeId(null)}
      onClick={() => setSelectedNodeId(id === selectedNodeId ? null : id)}
      title={`Usuario ${data.name || id} | Grado: ${degree} conexiones`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
        <User size={18} strokeWidth={2.5} style={{ marginBottom: 2 }} />
        <span style={{ fontSize: '1rem', fontWeight: 800, lineHeight: 1 }}>{id}</span>
      </div>

      {/* Badge de grado en la esquina superior derecha */}
      <div
        style={{
          position: 'absolute',
          top: -6,
          right: -6,
          backgroundColor: '#0B0F19',
          color: '#22D3EE',
          border: '1.5px solid #22D3EE',
          borderRadius: '9999px',
          width: 22,
          height: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
          fontWeight: 800,
          boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
        }}
        title={`Grado: ${degree}`}
      >
        {degree}
      </div>

      {/* Handle derecho para conectar con videos */}
      <Handle
        type="source"
        position={Position.Right}
        id="user-source"
        style={{
          background: '#22D3EE',
          width: 10,
          height: 10,
          border: '2px solid #0B0F19',
        }}
      />
      {/* Handle para recibir conexiones si se arrastra desde video */}
      <Handle
        type="target"
        position={Position.Right}
        id="user-target"
        style={{
          background: '#22D3EE',
          width: 10,
          height: 10,
          border: '2px solid #0B0F19',
          opacity: 0,
        }}
      />
    </div>
  );
}

export default memo(UserNodeComponent);
