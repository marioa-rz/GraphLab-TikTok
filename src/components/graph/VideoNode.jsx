import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Video, Sparkles } from 'lucide-react';
import { useGraph } from '../../context/GraphContext';

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
      {/* Handle izquierdo para conectar con usuarios */}
      <Handle
        type="target"
        position={Position.Left}
        id="video-target"
        style={{
          background: '#F472B6',
          width: 10,
          height: 10,
          border: '2px solid #0B0F19',
        }}
      />
      {/* Handle source si se arrastra desde video a usuario */}
      <Handle
        type="source"
        position={Position.Left}
        id="video-source"
        style={{
          background: '#F472B6',
          width: 10,
          height: 10,
          border: '2px solid #0B0F19',
          opacity: 0,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Video size={16} color="#F472B6" />
          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#F472B6', letterSpacing: '0.02em' }}>
            {id}
          </span>
        </div>

        {isRecommended && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              backgroundColor: '#22C55E',
              color: '#0B0F19',
              padding: '1px 6px',
              borderRadius: 4,
              fontSize: '0.65rem',
              fontWeight: 800,
            }}
          >
            <Sparkles size={10} /> RECOMENDADO
          </span>
        )}
      </div>

      <div
        style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#FFFFFF',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '150px',
        }}
      >
        {data.title}
      </div>

      {data.category && (
        <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: 2 }}>
          {data.category}
        </div>
      )}

      {/* Degree Badge */}
      <div
        style={{
          position: 'absolute',
          top: -6,
          right: -6,
          backgroundColor: '#0B0F19',
          color: '#F472B6',
          border: '1.5px solid #F472B6',
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
    </div>
  );
}

export default memo(VideoNodeComponent);
