import React from 'react';
import { getBezierPath, EdgeLabelRenderer } from '@xyflow/react';
import { useGraph } from '../../context/GraphContext';
import { X } from 'lucide-react';

export default function CustomEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) {
  const {
    selectedEdgeId,
    activeConnectedEdgeIds,
    highlightedEdgeIds,
    setSelectedEdgeId,
    removeEdge,
  } = useGraph();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isSelected = selectedEdgeId === id;
  const isConnectedToFocus = activeConnectedEdgeIds.has(id);
  const isInPath = highlightedEdgeIds.has(id);
  const isNew = data?.isNew;

  // Determinar color y estilo dinámico
  let strokeColor = '#475569';
  let strokeWidth = 2;
  let strokeDasharray = 'none';
  let animationClass = '';

  if (isInPath) {
    strokeColor = '#A855F7';
    strokeWidth = 4.5;
    strokeDasharray = '6, 6';
    animationClass = 'edge-flow-animation';
  } else if (isNew) {
    strokeColor = '#22C55E';
    strokeWidth = 3.5;
  } else if (isSelected) {
    strokeColor = '#38BDF8';
    strokeWidth = 3.5;
  } else if (isConnectedToFocus) {
    strokeColor = '#38BDF8';
    strokeWidth = 3;
  }

  return (
    <>
      <style>{`
        @keyframes dashdraw {
          from {
            stroke-dashoffset: 24;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .edge-flow-animation {
          animation: dashdraw 0.8s linear infinite;
        }
      `}</style>

      {/* Invisible wider stroke for easier clicking */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedEdgeId(isSelected ? null : id);
        }}
      />

      {/* Visible styled edge */}
      <path
        id={id}
        className={animationClass}
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        style={{
          ...style,
          transition: 'stroke 0.2s, stroke-width 0.2s',
          filter: isInPath
            ? 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.8))'
            : isNew
            ? 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))'
            : isConnectedToFocus
            ? 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.6))'
            : 'none',
        }}
      />

      {/* Delete button when edge is selected */}
      {isSelected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              zIndex: 10,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeEdge(id);
              }}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                color: 'white',
                border: '2px solid #0B0F19',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
              }}
              title={`Eliminar arista (${source}, ${target})`}
            >
              <X size={14} strokeWidth={3} />
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
