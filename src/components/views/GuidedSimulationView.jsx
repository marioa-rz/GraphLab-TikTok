import React, { useState, useEffect } from 'react';
import { useGraph } from '../../context/GraphContext';
import FlowGraph from '../graph/FlowGraph';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Users,
  Share2,
  Calculator,
  Compass,
  Heart,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Home,
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
      color: '#FFFFFF',
      text: 'Representamos el sistema como un conjunto de 9 vértices dividido en dos particiones disjuntas: el conjunto U de usuarios {A, B, C, D} (en blanco, izquierda) y el conjunto V de videos temáticos {V1 a V5} (en rojo carmín, derecha). En un grafo bipartito, nunca existen relaciones entre elementos del mismo grupo.',
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
      color: '#FE2C55',
      text: 'Cada interacción de «Me gusta» se modela como una arista no dirigida e = {u, v}. Contamos con 9 aristas iniciales: (A,V1), (A,V2), (B,V1), (B,V2), (B,V3), (C,V3), (C,V4), (D,V4), (D,V5). Es un grafo simple y bipartito: no hay líneas repetidas ni lazos.',
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
      color: '#FFFFFF',
      text: 'El grado deg(v) mide cuántas conexiones directas tiene un nodo. En usuarios: A=2, B=3, C=2, D=2 (el usuario B tiene el mayor grado en la partición U). En videos: V1=2, V2=2, V3=2, V4=2, V5=1 (V5 tiene la menor conectividad).',
      action: () => {
        setSelectedNodeId('B');
        setHighlightedPath([]);
        setRecommendedNodeId(null);
      },
    },
    {
      step: 4,
      title: '4. Comprobar el lema del apretón de manos',
      badge: '∑ deg(v) = 2 · |E|',
      icon: Calculator,
      color: '#10B981',
      text: 'Al sumar los grados de los usuarios (2 + 3 + 2 + 2 = 9) y de los videos (2 + 2 + 2 + 2 + 1 = 9), obtenemos 18. Al duplicar las 9 aristas tenemos 2 × 9 = 18. La igualdad se cumple estrictamente porque cada arista tiene dos extremos y se cuenta dos veces.',
      action: () => {
        setSelectedNodeId(null);
        setHighlightedPath([]);
        setRecommendedNodeId(null);
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 }, colors: ['#FE2C55', '#FFFFFF', '#10B981'] });
      },
    },
    {
      step: 5,
      title: '5. Encontrar trayectorias compartidas',
      badge: 'Trayectorias de longitud 2',
      icon: Compass,
      color: '#FACC15',
      text: 'Una trayectoria es un camino para recorrer el grafo. Los usuarios A y B no están conectados directamente, pero comparten dos caminos de longitud 2: A → V1 → B y A → V2 → B. Esto demuestra matemáticamente que comparten dos gustos idénticos.',
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
      color: '#FE2C55',
      text: 'Como A y B son usuarios afines y B ya interactuó con V3 («Mascotas graciosas») mientras que A todavía no lo ha visto, el sistema recomienda V3 al usuario A. La trayectoria que justifica la sugerencia es A → V1 → B → V3 (longitud 3).',
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
      color: '#E11D48',
      text: 'Simulamos el momento en que el usuario A acepta la recomendación y marca «Me gusta» a V3. Esto añade la arista (A, V3), transformando la estructura topológica de la red.',
      action: () => {
        simulateLike('A', 'V3');
      },
    },
    {
      step: 8,
      title: '8. Observar cómo cambia el grafo',
      badge: 'Evolución y Consumo Continuo',
      icon: CheckCircle2,
      color: '#10B981',
      text: 'El grafo se actualiza en vivo: deg(A) aumenta a 3, deg(V3) aumenta a 3, las aristas pasan a 10 y la suma de grados a 20 (20 = 2 × 10). La nueva interacción proporciona datos adicionales para sugerir más videos en el futuro.',
      action: () => {
        setSelectedNodeId(null);
        setHighlightedPath(['A', 'V3']);
        setRecommendedNodeId(null);
        confetti({ particleCount: 55, spread: 70, origin: { y: 0.7 }, colors: ['#FE2C55', '#FFFFFF', '#10B981'] });
      },
    },
  ];

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
    <div style={{ maxWidth: '1540px', margin: '0 auto', padding: '1.5rem 1.25rem' }}>
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
            <span className="badge badge-red">Modo Exposición Paso a Paso</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Paso {currentStep} de {STEPS.length}
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginTop: 4 }}>
            Simulación Guiada del Experimento
          </h2>
        </div>

        {/* Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveView('home')}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 5 }}
            title="Volver a la página principal"
          >
            <ArrowLeft size={15} />
            <span>Volver a Inicio</span>
          </button>

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
            style={{ padding: '6px 10px', color: '#FE2C55' }}
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
                backgroundColor: isCurrent ? '#FE2C55' : isDone ? '#10B981' : 'var(--border-subtle)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isCurrent ? '0 0 10px #FE2C55' : 'none',
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
        <div className="card" style={{ padding: '1.75rem', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(225, 29, 72, 0.12)',
                color: '#FE2C55',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-red)',
              }}
            >
              <StepIcon size={24} />
            </div>
            <div>
              <span className="badge badge-white" style={{ fontSize: '0.7rem' }}>
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
                fontSize: '0.85rem',
                marginBottom: '1rem',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <strong style={{ color: '#FFFFFF' }}>Usuarios:</strong> A=2, B=3, C=2, D=2 (Suma = 9)<br />
              <strong style={{ color: '#FE2C55' }}>Videos:</strong> V1=2, V2=2, V3=2, V4=2, V5=1 (Suma = 9)
            </div>
          )}

          {currentStep === 4 && (
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1.5px solid #10B981',
                padding: '0.875rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontFamily: 'Fira Code',
                color: '#10B981',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              ∑ deg(v) = 18 = 2 × 9 = 2 · |E| (¡Comprobado!)
            </div>
          )}

          {currentStep === 5 && (
            <div
              style={{
                backgroundColor: 'rgba(250, 204, 21, 0.1)',
                border: '1.5px solid #FACC15',
                padding: '0.875rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontFamily: 'Fira Code',
                color: '#FACC15',
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
                backgroundColor: 'rgba(225, 29, 72, 0.1)',
                border: '1.5px solid #FE2C55',
                padding: '0.875rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontFamily: 'Fira Code',
                color: '#FE2C55',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              Recomendación: V3 para A (Camino: A → V1 → B → V3, longitud 3)
            </div>
          )}

          {currentStep === 7 && (
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1.5px solid #10B981',
                padding: '0.875rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                color: '#10B981',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              ✓ Arista (A, V3) agregada exitosamente al grafo.
            </div>
          )}

          {currentStep === 8 && (
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid #FFFFFF',
                padding: '0.875rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                color: '#FFFFFF',
                marginBottom: '1rem',
              }}
            >
              Antes: 9 aristas, suma de grados 18.<br />
              Después: <strong style={{ color: '#10B981' }}>10 aristas, suma de grados 20 (20 = 2 × 10)</strong>.
            </div>
          )}

          {/* Quick jump to lab or home */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ¿Deseas experimentar libremente?
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setActiveView('home')}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              >
                Volver a Inicio
              </button>
              <button
                onClick={() => setActiveView('lab')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              >
                Ir al Laboratorio
              </button>
            </div>
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
