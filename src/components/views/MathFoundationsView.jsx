import React, { useState } from 'react';
import { runAcademicVerificationTests } from '../../math/tests';
import { useGraph } from '../../context/GraphContext';
import {
  BookOpen,
  Share2,
  Users,
  Video,
  Layers,
  Calculator,
  Compass,
  Sparkles,
  CheckCircle2,
  XCircle,
  Play,
  ArrowLeft,
  FlaskConical,
  Route,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MathFoundationsView({ setActiveView }) {
  const { setActiveLabTab } = useGraph();
  const [testResults, setTestResults] = useState(null);

  const handleRunTests = () => {
    const res = runAcademicVerificationTests();
    setTestResults(res);
    if (res.allPassed) {
      confetti({
        particleCount: 65,
        spread: 75,
        origin: { y: 0.75 },
        colors: ['#FE2C55', '#FFFFFF', '#10B981'],
      });
    }
  };

  const mathCards = [
    {
      id: 'concept-grafos',
      title: '1. ¿Qué es un Grafo?',
      symbol: 'G = (W, E)',
      color: '#FE2C55',
      formal:
        'Estructura matemática formada por un conjunto no vacío W de vértices y un conjunto E de aristas (pares no ordenados de vértices).',
      simple:
        'Un dibujo de puntos unidos por líneas. Sirve para representar elementos y las relaciones que existen entre ellos.',
      inApp:
        'En GraphLab TikTok, los puntos son los usuarios y los videos, y las líneas son los «Me gusta».',
    },
    {
      id: 'concept-vertices',
      title: '2. ¿Qué es un Vértice?',
      symbol: 'v ∈ W',
      color: '#FFFFFF',
      formal:
        'Elemento fundamental que representa una entidad discreta en la red. W = U ∪ V.',
      simple:
        'Cada uno de los puntos del dibujo. En un pizarrón con fotos, cada foto es un vértice.',
      inApp:
        'Tenemos 9 vértices: 4 usuarios en U (A, B, C, D) y 5 videos en V (V1 a V5).',
    },
    {
      id: 'concept-aristas',
      title: '3. ¿Qué es una Arista?',
      symbol: 'e = {u, v} ∈ E',
      color: '#FE2C55',
      formal:
        'Par que conecta dos vértices indicando la presencia de una relación bidireccional no dirigida.',
      simple:
        'Cada línea o hilo que une dos fotos. Significa: «a esta persona le gustó este video».',
      inApp:
        'El conjunto inicial tiene 9 aristas: (A,V1), (A,V2), (B,V1), (B,V2), (B,V3), etc.',
    },
    {
      id: 'concept-grado',
      title: '4. ¿Qué significa el Grado de un Vértice?',
      symbol: 'deg(v) = |N(v)|',
      color: '#FFFFFF',
      formal:
        'Número de aristas incidentes en el vértice v, es decir, el cardinal de su conjunto de vecinos.',
      simple:
        'Cuántos hilos tiene amarrados esa foto. Cuanto más hilos, más conexiones directas tiene.',
      inApp:
        'El usuario B tiene grado 3 porque vio 3 videos. El video V5 tiene grado 1 porque solo 1 usuario le dio like.',
      labTab: 'math',
      labLabel: 'Ver tabla de grados en el Lab',
    },
    {
      id: 'concept-bipartito',
      title: '5. ¿Qué es un Grafo Bipartito?',
      symbol: 'W = U ∪ V, U ∩ V = ∅, E ⊆ U × V',
      color: '#FE2C55',
      formal:
        'Grafo cuyos vértices pueden particionarse en dos conjuntos disjuntos tales que ninguna arista une vértices del mismo conjunto.',
      simple:
        'Los puntos están divididos en dos bandos. Las líneas siempre van de un bando al otro, nunca entre personas ni entre videos.',
      inApp:
        'El modelo prohíbe conexiones Usuario-Usuario y Video-Video. Toda relación es Usuario ↔ Video.',
    },
    {
      id: 'concept-trayectorias',
      title: '6. Trayectorias y Longitud de Trayectorias',
      symbol: 'P = (v0, v1, ..., vk), Longitud = k',
      color: '#FACC15',
      formal:
        'Sucesión finita de vértices unidos consecutivamente por aristas distintas. La longitud es el número de aristas que componen el camino.',
      simple:
        'Un camino para ir de un punto a otro saltando por las líneas. La longitud es cuántos saltos se dan.',
      inApp:
        'A → V1 → B tiene longitud 2 (dos saltos). Demuestra que A y B comparten el gusto por V1.',
      labTab: 'paths',
      labLabel: 'Probar Trayectorias BFS en Laboratorio',
    },
    {
      id: 'concept-euler',
      title: '7. Lema del Apretón de Manos (Euler)',
      symbol: '∑_{v ∈ W} deg(v) = 2 · |E|',
      color: '#10B981',
      formal:
        'En cualquier grafo finito no dirigido, la suma de los grados de todos los vértices es estrictamente el doble del número de aristas.',
      simple:
        'Cada línea tiene dos puntas, así que se cuenta dos veces. 9 apretones de manos involucran 18 manos.',
      inApp:
        'Original: 9 + 9 = 18 = 2 × 9. Con la nueva interacción (A,V3): 20 = 2 × 10.',
      labTab: 'math',
      labLabel: 'Ver calculadora de Euler en Laboratorio',
    },
    {
      id: 'concept-recomendaciones',
      title: '8. Generación de Recomendaciones',
      symbol: 'Puntuación(U, V) = ∑ |Comunes|',
      color: '#FE2C55',
      formal:
        'Heurística topológica que encuentra caminos de longitud 3: Usuario_Objetivo → Video_Común → Vecino_Similar → Video_Candidato.',
      simple:
        'Si a ti y a un amigo les gustaron las mismas 2 películas, y él vio una tercera que a ti te falta, lo más probable es que te guste.',
      inApp:
        'A y B comparten V1 y V2. B vio V3. La recomendación sugerida para A es V3.',
      labTab: 'recommendations',
      labLabel: 'Simular recomendación en Laboratorio',
    },
  ];

  return (
    <div style={{ maxWidth: '1540px', margin: '0 auto', padding: '1.5rem 1.25rem' }}>
      {/* Top Header Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 10 }}>
        <button
          onClick={() => setActiveView('home')}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          title="Volver a la página principal"
        >
          <ArrowLeft size={15} /> <span>Volver a Inicio</span>
        </button>

        <button
          onClick={() => setActiveView('lab')}
          className="btn btn-primary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <FlaskConical size={15} /> <span>Ir al Laboratorio Interactivo</span>
        </button>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 2.5rem' }}>
        <span className="badge badge-red" style={{ marginBottom: 8 }}>
          Marco Teórico Universitario
        </span>
        <h2 style={{ fontSize: '2rem', color: '#FFFFFF', marginBottom: '0.75rem' }}>
          Fundamentos Matemáticos de la Teoría de Grafos
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Cada concepto evaluado en clase, con su definición formal rigurosa, su explicación en palabras
          sencillas y su aplicación exacta dentro del simulador.
        </p>
      </div>

      {/* Concept Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3rem',
        }}
      >
        {mathCards.map((card, idx) => (
          <div
            key={idx}
            id={card.id}
            className="card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid var(--border-subtle)',
              scrollMarginTop: '100px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF' }}>{card.title}</h3>
              <span
                style={{
                  fontFamily: 'Fira Code',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: card.color,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  padding: '3px 8px',
                  borderRadius: 4,
                  border: `1px solid ${card.color}35`,
                }}
              >
                {card.symbol}
              </span>
            </div>

            {/* Formal Definition */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, marginBottom: 2 }}>
                Definición formal:
              </div>
              <p style={{ fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.45 }}>
                {card.formal}
              </p>
            </div>

            {/* In Simple Words */}
            <div
              style={{
                backgroundColor: 'rgba(8, 10, 15, 0.7)',
                borderLeft: `3px solid ${card.color}`,
                padding: '0.625rem 0.875rem',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ fontSize: '0.7rem', color: card.color, fontWeight: 800, marginBottom: 2 }}>
                En palabras simples:
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {card.simple}
              </p>
            </div>

            {/* In the Simulator */}
            <div style={{ marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: '#FFFFFF' }}>En este proyecto:</strong> {card.inApp}
            </div>

            {/* Interactive Lab Link if applicable */}
            {card.labTab && (
              <div style={{ marginTop: '0.75rem' }}>
                <button
                  onClick={() => {
                    setActiveLabTab(card.labTab);
                    setActiveView('lab');
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', fontSize: '0.78rem', color: card.color, border: `1px solid ${card.color}` }}
                >
                  🚀 {card.labLabel}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Section: Academic Test Suite Verifier */}
      <div
        className="card"
        style={{
          padding: '1.75rem',
          border: '1.5px solid var(--border-red)',
          background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.08) 0%, var(--bg-surface) 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <span className="badge badge-red" style={{ marginBottom: 6 }}>
              Validación Científica de Algoritmos
            </span>
            <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF' }}>
              Batería de Pruebas Unitarias del Proyecto (10 Casos de Prueba)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Ejecuta el conjunto completo de validaciones para comprobar ante el docente la exactitud de los cálculos.
            </p>
          </div>

          <button
            onClick={handleRunTests}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Play size={16} fill="white" />
            <span>Ejecutar las 10 Pruebas</span>
          </button>
        </div>

        {/* Results List */}
        {testResults && (
          <div style={{ marginTop: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.75rem 1rem',
                backgroundColor: testResults.allPassed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: testResults.allPassed ? '1px solid #10B981' : '1px solid #EF4444',
                borderRadius: 'var(--radius-md)',
                color: testResults.allPassed ? '#10B981' : '#EF4444',
                fontWeight: 800,
                fontSize: '0.9rem',
                marginBottom: '1rem',
              }}
            >
              {testResults.allPassed ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
              <span>
                {testResults.allPassed
                  ? `¡10 de 10 pruebas pasaron exitosamente! (100% verificado)`
                  : `${testResults.passedCount} de ${testResults.totalCount} pruebas pasadas.`}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {testResults.results.map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-surface-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8125rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    {r.passed ? (
                      <CheckCircle2 size={16} color="#10B981" style={{ marginTop: 2, flexShrink: 0 }} />
                    ) : (
                      <XCircle size={16} color="#EF4444" style={{ marginTop: 2, flexShrink: 0 }} />
                    )}
                    <div>
                      <strong style={{ color: '#FFFFFF' }}>{r.title}</strong>
                      <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>
                        Esperado: <code style={{ color: '#FFFFFF' }}>{r.expected}</code>
                      </div>
                      <div style={{ color: 'var(--text-muted)', marginTop: 1 }}>
                        Obtenido: <code style={{ color: '#10B981' }}>{r.actual}</code>
                      </div>
                    </div>
                  </div>

                  <span className={r.passed ? 'badge badge-green' : 'badge badge-red'}>
                    {r.passed ? 'CORRECTO' : 'FALLIDO'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
