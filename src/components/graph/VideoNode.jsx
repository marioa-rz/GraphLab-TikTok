import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Video, Sparkles, Smile, Home, Compass, Film, Flame } from 'lucide-react';
import { useGraph } from '../../context/GraphContext';

function getVideoIcon(id) {
  switch (id) {
    case 'V1':
      return <Film size={15} color="#FFFFFF" />;
    case 'V2':
      return <Flame size={15} color="#FFFFFF" />;
    case 'V3':
      return <Smile size={15} color="#FFFFFF" />;
    case 'V4':
      return <Home size={15} color="#FFFFFF" />;
    case 'V5':
      return <Compass size={15} color="#FFFFFF" />;
    default:
      return <Video size={15} color="#FFFFFF" />;
  }
}

function VideoNodeComponent({ id, data, selected }) {
  const {
    nodeDegreesMap,
    hoveredNodeId,
    selectedNodeId,
    activeConnectedNodeIds,
    highlightedPath,
    recommendedNodeId,
    setHoveredNodeId,
    setSelectedNodeId,
  } = useGraph();

  const degree = nodeDegreesMap.get(id) || 0;
  const isHovered = hoveredNodeId === id;
  const isSelected = selectedNodeId === id || selected;
  const isInActiveNeighborhood = activeConnectedNodeIds.has(id);
  const isInPath = highlightedPath.includes(id);
  const isRecommended = recommendedNodeId === id;

  const hasGlobalFocus =
    (hoveredNodeId && hoveredNodeId !== id) ||
    (selectedNodeId && selectedNodeId !== id) ||
    highlightedPath.length > 0;
  const isDimmed = hasGlobalFocus && !isInActiveNeighborhood && !isInPath && !isRecommended;

  const nodeClasses = [
    'node-video',
    (isHovered || isSelected) && 'highlighted',
    isInPath && 'path-highlighted',
    isRecommended && 'recommended-highlighted',
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
      title={`Video ${id}: ${data.title} | Grado: ${degree} Me gusta`}
    >
      {/* Left handle for connecting from users */}
      <Handle
        type="target"
        position={Position.Left}
        id="video-target"
        style={{
          background: '#FFFFFF',
          width: 10,
          height: 10,
          border: '2px solid #E11D48',
        }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="video-source"
        style={{
          background: '#FFFFFF',
          width: 10,
          height: 10,
          border: '2px solid #E11D48',
          opacity: 0,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {getVideoIcon(id)}
          <span style={{ fontWeight: 900, fontSize: '0.9rem', color: '#FFFFFF', letterSpacing: '0.02em' }}>
            {id}
          </span>
        </div>

        {isRecommended && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              padding: '2px 7px',
              borderRadius: 4,
              fontSize: '0.65rem',
              fontWeight: 800,
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)',
            }}
          >
            <Sparkles size={10} /> RECOMENDADO
          </span>
        )}
      </div>

      <div
        style={{
          fontSize: '0.82rem',
          fontWeight: 700,
          color: '#FFFFFF',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '160px',
        }}
      >
        {data.title}
      </div>

      {data.category && (
        <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: 2 }}>
          {data.category}
        </div>
      )}

      {/* Degree Badge: Pure White badge with dark crimson number */}
      <div
        style={{
          position: 'absolute',
          top: -7,
          right: -7,
          backgroundColor: '#FFFFFF',
          color: '#9F1239',
          border: '2px solid #E11D48',
          borderRadius: '9999px',
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.72rem',
          fontWeight: 900,
          boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
        }}
        title={`Grado: ${degree} «Me gusta»`}
      >
        {degree}
      </div>
    </div>
  );
}

export default memo(VideoNodeComponent);
