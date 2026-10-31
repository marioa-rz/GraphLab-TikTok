import React, { useState } from 'react';
import { runAcademicVerificationTests } from '../../math/tests';
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
  HelpCircle,
  Play,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MathFoundationsView({ setActiveView }) {
  const [testResults, setTestResults] = useState(null);

  const handleRunTests = () => {
    const res = runAcademicVerificationTests();
    setTestResults(res);
    if (res.allPassed) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.75 },
        colors: ['#22C55E', '#22D3EE', '#F472B6'],
      });
    }
  };

  const mathCards = [
    {
      title: '1. ¿Qué es un Grafo?',
      symbol: 'G = (W, E)',
      color: '#22D3EE',
      formal:
        'Estructura matemática formada por un conjunto no vacío W de vértices y un conjunto E de aristas (pares no ordenados de vértices).',
      simple:
        'Un dibujo de puntos unidos por líneas. Sirve para representar elementos y las relaciones que existen entre ellos.',
      inApp:
        'En GraphLab TikTok, los puntos son los usuarios y los videos, y las líneas son los «Me gusta».',
    },
    {
      title: '2. ¿Qué es un Vértice?',
      symbol: 'v ∈ W',
      color: '#38BDF8',
      formal:
        'Elemento fundamental que representa una entidad discreta en la red. W = U ∪ V.',
      simple:
        'Cada uno de los puntos del dibujo. En un corcho con fotos, cada foto es un vértice.',
      inApp:
        'Tenemos 9 vértices: 4 usuarios en U (A, B, C, D) y 5 videos en V (V1 a V5).',
    },
    {
      title: '3. ¿Qué es una Arista?',
      symbol: 'e = {u, v} ∈ E',
      color: '#F472B6',
      formal:
        'Par que conecta dos vértices indicando la presencia de una relación bidireccional no dirigida.',
      simple:
        'Cada línea o hilo de lana que une dos fotos. Significa: «a esta persona le gustó este video».',
      inApp:
        'El conjunto inicial tiene 9 aristas: (A,V1), (A,V2), (B,V1), (B,V2), (B,V3), etc.',
    },
    {
      title: '4. ¿Qué significa el Grado de un Vértice?',
      symbol: 'deg(v) = |N(v)|',
      color: '#EC4899',
      formal:
        'Número de aristas incidentes en el vértice v, es decir, el cardinal de su conjunto de vecinos.',
      simple:
        'Cuántos hilos tiene amarrados esa foto. Cuanto más hilos, más conexiones directas tiene.',
      inApp:
        'El usuario B tiene grado 3 porque vio 3 videos. El video V5 tiene grado 1 porque solo 1 usuario le dio like.',
    },
    {
      title: '5. ¿Qué es un Grafo Bipartito?',
      symbol: 'W = U ∪ V, U ∩ V = ∅, E ⊆ U × V',
      color: '#A855F7',
      formal:
        'Grafo cuyos vértices pueden particionarse en dos conjuntos disjuntos tales que ninguna arista une vértices del mismo conjunto.',
      simple:
        'Los puntos están divididos en dos bandos. Las líneas siempre van de un bando al otro, nunca entre personas ni entre videos.',
      inApp:
        'El modelo prohíbe conexiones Usuario-Usuario y Video-Video. Toda relación es Usuario ↔ Video.',
    },
    {
      title: '6. Trayectorias y Longitud de Trayectorias',
      symbol: 'P = (v0, v1, ..., vk), Longitud = k',
      color: '#C084FC',
      formal:
        'Sucesión finita de vértices unidos consecutivamente por aristas distintas. La longitud es el número de aristas que componen el camino.',
      simple:
        'Un camino para ir de un punto a otro saltando por las líneas. La longitud es cuántos saltos se dan.',
      inApp:
        'A → V1 → B tiene longitud 2 (dos saltos). Demuestra que A y B comparten el gusto por V1.',
    },
    {
      title: '7. Lema del Apretón de Manos (Euler)',
      symbol: 'Σ_{v ∈ W} deg(v) = 2 · |E|',
      color: '#22C55E',
      formal:
        'En cualquier grafo finito no dirigido, la suma de los grados de todos los vértices es estrictamente el doble del número de aristas.',
      simple:
        'Cada línea tiene dos puntas, así que se cuenta dos veces. 9 apretones de manos involucran 18 manos.',
      inApp:
        'Original: 9 + 9 = 18 = 2 × 9. Con la nueva interacción (A,V3): 20 = 2 × 10.',
    },
    {
      title: '8. Generación de Recomendaciones',
      symbol: 'Puntuación(U, V) = Σ |Comunes|',
      color: '#F59E0B',
      formal:
        'Heurística topológica que encuentra caminos de longitud 3: Usuario_Objetivo → Video_Común → Vecino_Similar → Video_Candidato.',
      simple:
        'Si a ti y a un amigo les gustaron las mismas 2 películas, y él vio una tercera que a ti te falta, lo más probable es que te guste.',
      inApp:
        'A y B comparten V1 y V2. B vio V3. La recomendación sugerida para A es V3.',
    },
  ];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem 1.25rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 2.5rem' }}>
        <span className="badge badge-cyan" style={{ marginBottom: 8 }}>
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
          <div key={idx} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF' }}>{card.title}</h3>
              <span
                style={{
                  fontFamily: 'Fira Code',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: card.color,
                  backgroundColor: `${card.color}15`,
                  padding: '2px 8px',
                  borderRadius: 4,
                  border: `1px solid ${card.color}35`,
                }}
              >
                {card.symbol}
              </span>
            </div>

            {/* Formal Definition */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 2 }}>
                Definición formal:
              </div>
              <p style={{ fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.45 }}>
                {card.formal}
              </p>
            </div>

            {/* In Simple Words (Just like paper!) */}
            <div
              style={{
                backgroundColor: 'rgba(21, 27, 43, 0.7)',
                borderLeft: `3px solid ${card.color}`,
                padding: '0.625rem 0.875rem',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ fontSize: '0.7rem', color: card.color, fontWeight: 700, marginBottom: 2 }}>
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
          </div>
        ))}
      </div>

      {/* Section: Academic Test Suite Verifier */}
      <div
        className="card"
        style={{
          padding: '1.75rem',
          border: '1px solid var(--border-focus)',
          background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.05) 0%, var(--bg-surface) 100%)',
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
            <span className="badge badge-green" style={{ marginBottom: 6 }}>
              Verificación y Validación Académica
            </span>
            <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF' }}>
              Batería de Pruebas Unitarias del Proyecto (10 Casos de Prueba)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Ejecuta el conjunto completo de validaciones para demostrar ante el docente que todos los cálculos matemáticos son exactos y consistentes.
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
                backgroundColor: testResults.allPassed ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: testResults.allPassed ? '1px solid #22C55E' : '1px solid #EF4444',
                borderRadius: 'var(--radius-md)',
                color: testResults.allPassed ? '#22C55E' : '#EF4444',
                fontWeight: 700,
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
                      <CheckCircle2 size={16} color="#22C55E" style={{ marginTop: 2, flexShrink: 0 }} />
                    ) : (
                      <XCircle size={16} color="#EF4444" style={{ marginTop: 2, flexShrink: 0 }} />
                    )}
                    <div>
                      <strong style={{ color: '#FFFFFF' }}>{r.title}</strong>
                      <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>
                        Esperado: <code style={{ color: '#38BDF8' }}>{r.expected}</code>
                      </div>
                      <div style={{ color: 'var(--text-muted)', marginTop: 1 }}>
                        Obtenido: <code style={{ color: '#22C55E' }}>{r.actual}</code>
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
