import React, { useEffect } from 'react';
import { useGraph } from '../../context/GraphContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast, closeToast } = useGraph();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      closeToast();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, closeToast]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 100,
        backgroundColor: 'var(--bg-surface)',
        border: `1px solid ${isSuccess ? '#22C55E' : isError ? '#EF4444' : '#38BDF8'}`,
        boxShadow: 'var(--shadow-lg)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        maxWidth: 420,
        animation: 'fadeIn 0.25s ease-out',
      }}
    >
      {isSuccess && <CheckCircle2 size={18} color="#22C55E" style={{ flexShrink: 0 }} />}
      {isError && <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0 }} />}
      {!isSuccess && !isError && <Info size={18} color="#38BDF8" style={{ flexShrink: 0 }} />}

      <span style={{ fontSize: '0.85rem', color: '#FFFFFF', flex: 1, lineHeight: 1.4 }}>
        {toast.message}
      </span>

      <button
        onClick={closeToast}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
