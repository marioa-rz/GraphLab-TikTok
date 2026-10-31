import React, { useState } from 'react';
import { useGraph } from '../../context/GraphContext';
import { RefreshCw, Play, RotateCcw, AlertTriangle, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { calculateRecommendations } from '../../math/graphLogic';

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

  // Ciclos predefinidos que demuestran la evolución del grafo
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
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={20} color="#F59E0B" />
            Bucle de Retroalimentación y Consumo Continuo
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Simulación dinámica de cómo las interacciones sucesivas alimentan el ciclo de recomendaciones.
          </p>
        </div>

        <button
          onClick={handleResetCycles}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', padding: '4px 10px' }}
        >
          <RotateCcw size={12} /> Reiniciar bucle
        </button>
      </div>

      {/* Process flow diagram */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '0.5rem',
          backgroundColor: 'var(--bg-surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div style={{ textAlign: 'center', padding: '0.5rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#22D3EE', fontWeight: 800 }}>PASO 1</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FFFFFF', marginTop: 2 }}>Usuario interactúa</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Marca «Me gusta» a un video</div>
        </div>

        <div style={{ textAlign: 'center', padding: '0.5rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#38BDF8', fontWeight: 800 }}>PASO 2</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FFFFFF', marginTop: 2 }}>Nueva arista</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Se registra (U, V) en el grafo</div>
        </div>

        <div style={{ textAlign: 'center', padding: '0.5rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#A855F7', fontWeight: 800 }}>PASO 3</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FFFFFF', marginTop: 2 }}>Actualiza grados</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Σ deg(v) = 2·|E|</div>
        </div>

        <div style={{ textAlign: 'center', padding: '0.5rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#F472B6', fontWeight: 800 }}>PASO 4</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FFFFFF', marginTop: 2 }}>Recomendación</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Surgen nuevas trayectorias</div>
        </div>

        <div style={{ textAlign: 'center', padding: '0.5rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#22C55E', fontWeight: 800 }}>PASO 5</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FFFFFF', marginTop: 2 }}>Consumo repetitivo</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>El ciclo se reinicia</div>
        </div>
      </div>

      {/* Cycle Runner Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF' }}>
            Ciclo actual: {currentCycle} de {CYCLES.length + 1}
          </span>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {currentCycle <= CYCLES.length
              ? `Próxima acción: ${CYCLES[currentCycle - 1].explanation}`
              : 'Se completaron todos los ciclos demostrativos.'}
          </p>
        </div>

        <button
          onClick={handleNextCycle}
          disabled={currentCycle > CYCLES.length}
          className="btn btn-primary btn-sm"
          style={{ padding: '6px 14px' }}
        >
          <Play size={14} />
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
              <th style={{ padding: '0.5rem 0.75rem' }}>Suma Grados</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Impacto</th>
            </tr>
          </thead>
          <tbody>
            {cycleLog.map((log) => (
              <tr key={log.cycle} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, color: '#22D3EE' }}>
                  #{log.cycle}
                </td>
                <td style={{ padding: '0.5rem 0.75rem', color: '#FFFFFF' }}>
                  {log.title}
                </td>
                <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'Fira Code', color: '#F472B6' }}>
                  {log.edgeCount}
                </td>
                <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'Fira Code', color: '#A855F7' }}>
                  {log.totalDegree}
                </td>
                <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-secondary)' }}>
                  <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                    Suma = 2 × {log.edgeCount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mandatory Academic Disclaimer Banner */}
      <div
        style={{
          padding: '0.875rem 1rem',
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
        }}
      >
        <AlertTriangle size={20} color="#F59E0B" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: '0.8rem', color: '#FCD34D', lineHeight: 1.45 }}>
          <strong>Aclaración académica oficial:</strong> Esta simulación explica un mecanismo simplificado de personalización de contenido mediante teoría de grafos. <em>No permite diagnosticar adicción ni demostrar que las recomendaciones la provoquen</em>. Recibir videos relacionados puede favorecer el tiempo de estancia en una plataforma, pero la conducta de uso problemático depende de factores psicológicos, ambientales y de diseño mucho más complejos que la topología de un grafo simple.
        </div>
      </div>
    </div>
  );
}
