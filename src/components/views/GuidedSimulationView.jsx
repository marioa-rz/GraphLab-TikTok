import React, { useState, useEffect } from 'react';
import { useGraph } from '../../context/GraphContext';
import FlowGraph from '../graph/FlowGraph';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Users,
  Video,
  Share2,
  Calculator,
  Compass,
  Heart,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GuidedSimulationView({ setActiveView }) {
  const {
    users,
    videos,
    edges,
    degrees,
    lemma,
    setHighlightedPath,
    setRecommendedNodeId,
    setSelectedNodeId,
    simulateLike,
    resetToOriginal,
  } = useGraph();

  const [currentStep, setCurrentStep] = useState(1);

  const STEPS = [
    {
      step: 1,
      title: '1. Conocer los usuarios y videos',
      badge: 'Vértices W = U ∪ V',
      icon: Users,
      color: '#22D3EE',
      text: 'Representamos el sistema como un conjunto de vértices dividido en dos particiones disjuntas: el conjunto U de usuarios {A, B, C, D} y el conjunto V de videos temáticos {V1, V2, V3, V4, V5}. En este modelo matemático simplificado, los usuarios están a la izquierda y los videos a la derecha.',
      action: () => {
        setSelectedNodeId(null);
        setHighlightedPath([]);
        setRecommendedNodeId(null);
      },
    },
    {
      step: 2,
      title: '2. Visualizar sus conexiones',
      badge: 'Conjunto de Aristas E',
      icon: Share2,
      color: '#38BDF8',
      text: 'Cada interacción de «Me gusta» se modela como una arista no dirigida e = {u, v}. Contamos con 9 aristas iniciales: (A,V1), (A,V2), (B,V1), (B,V2), (B,V3), (C,V3), (C,V4), (D,V4), (D,V5). El grafo es bipartito simple: nunca une dos personas entre sí ni dos videos entre sí.',
      action: () => {
        setSelectedNodeId(null);
        setHighlightedPath([]);
        setRecommendedNodeId(null);
      },
    },
    {
      step: 3,
      title: '3. Calcular los grados de los vértices',
      badge: 'Grado deg(v)',
      icon: TrendingUp,
      color: '#F472B6',
      text: 'El grado deg(v) es cuántas líneas salen de cada punto. En usuarios: A=2, B=3, C=2, D=2 (el usuario B tiene la mayor cantidad de interacciones). En videos: V1=2, V2=2, V3=2, V4=2, V5=1 (V5 tiene menos interacciones, lo que significa que el sistema dispone de menos información para asociarlo).',
      action: () => {
        setSelectedNodeId('B');
        setHighlightedPath([]);
        setRecommendedNodeId(null);
      },
    },
    {
      step: 4,
      title: '4. Comprobar el lema del apretón de manos',
      badge: 'Σ deg(v) = 2 · |E|',
      icon: Calculator,
      color: '#22C55E',
      text: 'Al sumar todos los grados de los usuarios (2 + 3 + 2 + 2 = 9) y de los videos (2 + 2 + 2 + 2 + 1 = 9), obtenemos una suma total de 18. Como tenemos 9 aristas, 18 = 2 × 9. La igualdad se cumple exactamente porque cada arista tiene dos extremos y se cuenta dos veces.',
      action: () => {
        setSelectedNodeId(null);
        setHighlightedPath([]);
        setRecommendedNodeId(null);
        confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
      },
    },
    {
      step: 5,
      title: '5. Encontrar trayectorias compartidas',
      badge: 'Trayectorias de longitud 2',
      icon: Compass,
      color: '#A855F7',
      text: 'Una trayectoria es un camino que une vértices. Los usuarios A y B no están unidos directamente, pero comparten dos trayectorias de longitud 2: A → V1 → B y A → V2 → B. Esto demuestra formalmente que ambos interactuaron con los mismos dos videos y por tanto tienen gustos afines.',
      action: () => {
        setSelectedNodeId(null);
        setHighlightedPath(['A', 'V1', 'B']);
        setRecommendedNodeId(null);
      },
    },
    {
      step: 6,
      title: '6. Generar una recomendación',
      badge: 'Trayectoria de longitud 3',
      icon: Sparkles,
      color: '#EC4899',
      text: 'Como A y B comparten intereses y B ya interactuó con V3 («Mascotas graciosas») mientras que A todavía no, el sistema sugiere V3 al usuario A. La trayectoria que justifica la recomendación es A → V1 → B → V3 (longitud 3).',
      action: () => {
        setSelectedNodeId(null);
        setRecommendedNodeId('V3');
        setHighlightedPath(['A', 'V1', 'B', 'V3']);
      },
    },
    {
      step: 7,
      title: '7. Agregar una nueva interacción',
      badge: 'Simulación (A, V3)',
      icon: Heart,
      color: '#EF4444',
      text: 'Simulamos el momento en que el usuario A acepta la recomendación y marca «Me gusta» al video V3. Esto crea la nueva arista (A, V3), transformando la topología de la red social.',
      action: () => {
        simulateLike('A', 'V3');
      },
    },
    {
      step: 8,
      title: '8. Observar cómo cambia el grafo',
      badge: 'Evolución y Consumo Continuo',
      icon: CheckCircle2,
      color: '#22C55E',
      text: 'El grafo se actualizó en vivo: el grado de A aumentó de 2 a 3, el grado de V3 aumentó de 2 a 3, las aristas pasaron de 9 a 10 y la suma de grados pasó de 18 a 20 (20 = 2 × 10). Una nueva interacción proporciona datos adicionales para recomendaciones futuras, explicando el bucle de retroalimentación.',
      action: () => {
        setSelectedNodeId(null);
        setHighlightedPath(['A', 'V3']);
        setRecommendedNodeId(null);
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
      },
    },
  ];

  // Aplicar acción del paso cuando cambia
  useEffect(() => {
    const currentObj = STEPS[currentStep - 1];
    if (currentObj && currentObj.action) {
      currentObj.action();
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    resetToOriginal();
    setCurrentStep(1);
  };

  const activeStepData = STEPS[currentStep - 1];
  const StepIcon = activeStepData.icon;

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem 1.25rem' }}>
      {/* Top Banner / Progress Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="badge badge-cyan">Modo Exposición Paso a Paso</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Paso {currentStep} de {STEPS.length}
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginTop: 4 }}>
            Simulación Guiada del Experimento
          </h2>
        </div>

        {/* Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 14px' }}
          >
            <ChevronLeft size={16} />
            <span>Anterior</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === STEPS.length}
            className="btn btn-primary btn-sm"
            style={{ padding: '6px 14px' }}
          >
            <span>Siguiente</span>
            <ChevronRight size={16} />
          </button>

          <button
            onClick={handleRestart}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px 10px', color: '#F472B6' }}
            title="Reiniciar presentación desde el paso 1"
          >
            <RotateCcw size={14} />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Step Pills Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`,
          gap: 6,
          marginBottom: '1.25rem',
        }}
      >
        {STEPS.map((s) => {
          const isDone = s.step < currentStep;
          const isCurrent = s.step === currentStep;
          return (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              style={{
                height: 8,
                borderRadius: 'var(--radius-full)',
                backgroundColor: isCurrent ? s.color : isDone ? '#22C55E' : 'var(--border-subtle)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isCurrent ? `0 0 10px ${s.color}` : 'none',
              }}
              title={s.title}
            />
          );
        })}
      </div>

      {/* Main Grid: Explanation Card + Live Graph Visualizer */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* Explanation Card */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                backgroundColor: `${activeStepData.color}15`,
                color: activeStepData.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <StepIcon size={24} />
            </div>
            <div>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                {activeStepData.badge}
              </span>
              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginTop: 2 }}>
                {activeStepData.title}
              </h3>
            </div>
          </div>

          <p
            style={{
              fontSize: '0.95rem',
              color: '#E2E8F0',
              lineHeight: 1.6,
              marginBottom: '1.5rem',
            }}
          >
            {activeStepData.text}
          </p>

          {/* Dynamic contextual data box depending on step */}
          {currentStep === 3 && (
            <div
              style={{
                backgroundColor: 'var(--bg-surface-card)',
                padding: '0.875rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                marginBottom: '1rem',
              }}
            >
              <strong style={{ color: '#22D3EE' }}>Usuarios:</strong> A=2, B=3, C=2, D=2 (Suma = 9)<br />
              <strong style={{ color: '#F472B6' }}>Videos:</strong> V1=2, V2=2, V3=2, V4=2, V5=1 (Suma = 9)
            </div>
          )}

          {currentStep === 4 && (
            <div
              style={{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid #22C55E',
                padding: '0.875rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontFamily: 'Fira Code',
                color: '#86EFAC',
                marginBottom: '1rem',
              }}
            >
              Σ deg(v) = 18 = 2 × 9 = 2 · |E| (¡Comprobado!)
            </div>
          )}

          {currentStep === 5 && (
            <div
              style={{
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid #A855F7',
                padding: '0.875rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontFamily: 'Fira Code',
                color: '#D8B4FE',
                marginBottom: '1rem',
              }}
            >
              Camino 1: A → V1 → B (longitud 2)<br />
              Camino 2: A → V2 → B (longitud 2)
            </div>
          )}

          {currentStep === 6 && (
            <div
              style={{
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                border: '1px solid #EC4899',
                padding: '0.875rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontFamily: 'Fira Code',
                color: '#F472B6',
                marginBottom: '1rem',
              }}
            >
              Recomendación: V3 para A (Camino: A → V1 → B → V3, longitud 3)
            </div>
          )}

          {currentStep === 7 && (
            <div
              style={{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid #22C55E',
                padding: '0.875rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                color: '#86EFAC',
                marginBottom: '1rem',
              }}
            >
              ✓ Arista (A, V3) agregada exitosamente al grafo.
            </div>
          )}

          {currentStep === 8 && (
            <div
              style={{
                backgroundColor: 'rgba(34, 211, 238, 0.1)',
                border: '1px solid #22D3EE',
                padding: '0.875rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                color: '#E2E8F0',
                marginBottom: '1rem',
              }}
            >
              Antes: 9 aristas, suma de grados 18.<br />
              Después: <strong>10 aristas, suma de grados 20 (20 = 2 × 10)</strong>.
            </div>
          )}

          {/* Quick jump to lab */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ¿Deseas experimentar libremente?
            </span>
            <button
              onClick={() => setActiveView('lab')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              Ir al Laboratorio
            </button>
          </div>
        </div>

        {/* Visualizer Canvas */}
        <div>
          <FlowGraph height="580px" interactive={true} />
        </div>
      </div>
    </div>
  );
}
