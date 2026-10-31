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

  // Dimming logic
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
        <User size={19} color="#080A0F" strokeWidth={2.7} style={{ marginBottom: 1 }} />
        <span style={{ fontSize: '1rem', fontWeight: 900, lineHeight: 1, color: '#080A0F' }}>{id}</span>
      </div>

      {/* Degree Badge: Crimson Red pill with White text */}
      <div
        style={{
          position: 'absolute',
          top: -7,
          right: -7,
          backgroundColor: '#E11D48',
          color: '#FFFFFF',
          border: '2px solid #FFFFFF',
          borderRadius: '9999px',
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.72rem',
          fontWeight: 800,
          boxShadow: '0 2px 6px rgba(225, 29, 72, 0.6)',
        }}
        title={`Grado: ${degree} interacciones`}
      >
        {degree}
      </div>

      {/* Right handle to connect with videos */}
      <Handle
        type="source"
        position={Position.Right}
        id="user-source"
        style={{
          background: '#E11D48',
          width: 10,
          height: 10,
          border: '2px solid #FFFFFF',
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="user-target"
        style={{
          background: '#E11D48',
          width: 10,
          height: 10,
          border: '2px solid #FFFFFF',
          opacity: 0,
        }}
      />
    </div>
  );
}

export default memo(UserNodeComponent);
