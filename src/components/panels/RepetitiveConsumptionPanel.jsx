import React, { useState } from 'react';
import { useGraph } from '../../context/GraphContext';
import { Layers, Play, RotateCcw, AlertTriangle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export default function RepetitiveConsumptionPanel() {
  const { users, videos, edges, addEdge, resetToOriginal } = useGraph();
  const [currentCycle, setCurrentCycle] = useState(1);
  const [cycleLog, setCycleLog] = useState([
    {
      cycle: 1,
      title: 'Grafo base inicial',
      interaction: 'Estado original con 9 conexiones',
      edgeCount: 9,
      totalDegree: 18,
      recommendationA: 'V3',
    },
  ]);

  const CYCLES = [
    {
      cycle: 2,
      user: 'A',
      video: 'V3',
      title: 'Ciclo 1: A acepta la recomendación de V3',
      explanation: 'A le da Me gusta a V3 tras recibir la recomendación inicial.',
    },
    {
      cycle: 3,
      user: 'C',
      video: 'V2',
      title: 'Ciclo 2: C interactúa con V2',
      explanation: 'El usuario C explora contenido canino (V2), creando una nueva conexión transversal.',
    },
    {
      cycle: 4,
      user: 'D',
      video: 'V3',
      title: 'Ciclo 3: D conecta con Mascotas graciosas (V3)',
      explanation: 'Se densifica la red de interacciones entre los usuarios C y D hacia V3.',
    },
  ];

  const handleNextCycle = () => {
    if (currentCycle > CYCLES.length) return;

    const nextStep = CYCLES[currentCycle - 1];
    addEdge(nextStep.user, nextStep.video, true);

    const newLogItem = {
      cycle: currentCycle + 1,
      title: nextStep.title,
      interaction: `(${nextStep.user}, ${nextStep.video})`,
      edgeCount: edges.length + 1,
      totalDegree: (edges.length + 1) * 2,
      recommendationA: currentCycle === 1 ? 'V4' : 'Personalizado continuo',
    };

    setCycleLog((prev) => [...prev, newLogItem]);
    setCurrentCycle((prev) => prev + 1);
  };

  const handleResetCycles = () => {
    resetToOriginal();
    setCurrentCycle(1);
    setCycleLog([
      {
        cycle: 1,
        title: 'Grafo base inicial',
        interaction: 'Estado original con 9 conexiones',
        edgeCount: 9,
        totalDegree: 18,
        recommendationA: 'V3',
      },
    ]);
  };

  return (
    <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={20} color="#FE2C55" />
            <span>Módulo de Reflexión: Ciclo de Consumo Repetitivo & Ética</span>
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Diagrama cíclico de retroalimentación algorítmica y análisis de permanencia.
          </p>
        </div>

        <button
          onClick={handleResetCycles}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#FE2C55' }}
        >
          <RotateCcw size={12} /> Reiniciar bucle
        </button>
      </div>

      {/* Cyclic Diagram HUD */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.5rem',
          backgroundColor: 'rgba(8, 10, 15, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div style={{ textAlign: 'center', padding: '0.4rem' }}>
          <div style={{ fontSize: '0.68rem', color: '#FFFFFF', fontWeight: 800 }}>PASO 1</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF', marginTop: 2 }}>Interacción</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Me gusta a un video</div>
        </div>

        <div style={{ textAlign: 'center', padding: '0.4rem' }}>
          <div style={{ fontSize: '0.68rem', color: '#FE2C55', fontWeight: 800 }}>PASO 2</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FE2C55', marginTop: 2 }}>Nueva Arista</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Registro (U, V) en E</div>
        </div>

        <div style={{ textAlign: 'center', padding: '0.4rem' }}>
          <div style={{ fontSize: '0.68rem', color: '#FACC15', fontWeight: 800 }}>PASO 3</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FACC15', marginTop: 2 }}>Recálculo</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>deg(u) y deg(v)</div>
        </div>

        <div style={{ textAlign: 'center', padding: '0.4rem' }}>
          <div style={{ fontSize: '0.68rem', color: '#E11D48', fontWeight: 800 }}>PASO 4</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E11D48', marginTop: 2 }}>Sugerencia</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Nuevos caminos BFS</div>
        </div>

        <div style={{ textAlign: 'center', padding: '0.4rem' }}>
          <div style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 800 }}>PASO 5</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10B981', marginTop: 2 }}>Retención</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Consumo continuo</div>
        </div>
      </div>

      {/* Cycle Runner Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#FFFFFF' }}>
            Ciclo simulado: {currentCycle} de {CYCLES.length + 1}
          </span>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            {currentCycle <= CYCLES.length
              ? `Próxima acción: ${CYCLES[currentCycle - 1].explanation}`
              : 'Se completaron los ciclos demostrativos.'}
          </p>
        </div>

        <button
          onClick={handleNextCycle}
          disabled={currentCycle > CYCLES.length}
          className="btn btn-primary btn-sm"
          style={{ padding: '6px 14px' }}
        >
          <Play size={14} fill="white" />
          <span>Avanzar al siguiente ciclo</span>
        </button>
      </div>

      {/* Cycle History Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          marginBottom: '1rem',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem 0.75rem' }}>Ciclo</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Evento</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Aristas |E|</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>∑ deg(v)</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Lema Euler</th>
            </tr>
          </thead>
          <tbody>
            {cycleLog.map((log) => (
              <tr key={log.cycle} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: 800, color: '#FFFFFF' }}>
                  #{log.cycle}
                </td>
                <td style={{ padding: '0.5rem 0.75rem', color: '#FFFFFF' }}>
                  {log.title}
                </td>
                <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'Fira Code', color: '#FE2C55', fontWeight: 700 }}>
                  {log.edgeCount}
                </td>
                <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'Fira Code', color: '#FFFFFF', fontWeight: 700 }}>
                  {log.totalDegree}
                </td>
                <td style={{ padding: '0.5rem 0.75rem' }}>
                  <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>
                    {log.totalDegree} = 2 · {log.edgeCount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Academic & Ethical Note */}
      <div
        style={{
          padding: '0.875rem 1rem',
          backgroundColor: 'rgba(225, 29, 72, 0.08)',
          border: '1.5px solid var(--border-red)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
        }}
      >
        <ShieldAlert size={20} color="#FE2C55" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: '0.8rem', color: '#E2E8F0', lineHeight: 1.45 }}>
          <strong style={{ color: '#FE2C55' }}>Nota ética y académica indispensable:</strong> Esta simulación explica el mecanismo matemático de personalización de contenido mediante grafos bipartitos. <em>No permite diagnosticar adicción ni demostrar una causalidad determinista de dependencia psicológica</em>. El uso problemático de pantallas involucra variables humanas, hábitos y diseño persuasivo mucho más complejos que la topología de un grafo simple.
        </div>
      </div>
    </div>
  );
}
