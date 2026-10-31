import React, { useState } from 'react';
import { academicContext } from '../../data/academicContext';
import { GraduationCap, Users, BookOpen, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const [showReferences, setShowReferences] = useState(false);

  return (
    <footer
      style={{
        backgroundColor: '#05070B',
        borderTop: '1px solid var(--border-subtle)',
        padding: '2.5rem 1.25rem 2rem',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: '1540px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
          }}
        >
          {/* Institutional Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
              <GraduationCap size={20} color="#FE2C55" />
              <h4 style={{ fontSize: '0.95rem', color: '#FFFFFF', fontWeight: 800 }}>
                {academicContext.university}
              </h4>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
              {academicContext.faculty} — Curso de {academicContext.course}.
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Catedrático: <strong style={{ color: '#FFFFFF' }}>{academicContext.professor}</strong> | Sección:{' '}
              <strong style={{ color: '#FE2C55' }}>{academicContext.section}</strong>
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Fecha de entrega: {academicContext.deliveryDate}
            </p>
          </div>

          {/* Authors */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
              <Users size={20} color="#FFFFFF" />
              <h4 style={{ fontSize: '0.95rem', color: '#FFFFFF', fontWeight: 800 }}>
                Integrantes del Proyecto
              </h4>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8125rem' }}>
              {academicContext.authors.map((author) => (
                <li key={author.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#E2E8F0' }}>
                  <span>{author.name}</span>
                  <span style={{ fontFamily: 'Fira Code', color: '#FE2C55', fontSize: '0.75rem', fontWeight: 700 }}>
                    {author.id}
                  </span>
                </li>
              ))}
            </ul>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Participación equitativa del 100% en todas las etapas del trabajo.
            </p>
          </div>

          {/* Academic Topic & References */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
              <BookOpen size={20} color="#FE2C55" />
              <h4 style={{ fontSize: '0.95rem', color: '#FFFFFF', fontWeight: 800 }}>
                Marco Teórico y Bibliografía
              </h4>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              {academicContext.projectTitle}
            </p>
            <button
              onClick={() => setShowReferences(!showReferences)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#FFFFFF' }}
            >
              {showReferences ? 'Ocultar bibliografía' : 'Ver referencias bibliográficas'}
            </button>
          </div>
        </div>

        {/* Expandable References Box */}
        {showReferences && (
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <h5 style={{ fontSize: '0.875rem', color: '#FFFFFF', marginBottom: 10, fontWeight: 700 }}>
              Referencias Bibliográficas (Formato APA):
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {academicContext.references.map((ref, idx) => (
                <div key={idx} style={{ paddingLeft: '1rem', textIndent: '-1rem' }}>
                  • {ref.authors} ({ref.year}). <em>{ref.title}</em>. {ref.source}.{' '}
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#FE2C55', textDecoration: 'underline' }}
                    >
                      Enlace
                    </a>
                  )}
                  {ref.doi && (
                    <a
                      href={ref.doi}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#FE2C55', textDecoration: 'underline' }}
                    >
                      {ref.doi}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Disclaimer */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={16} color="#10B981" />
            <span>
              Herramienta académica desarrollada para fines de aprendizaje en Matemática Discreta. No asociada con ByteDance / TikTok Inc.
            </span>
          </div>
          <div>© 2026 Universidad Mariano Gálvez de Guatemala</div>
        </div>
      </div>
    </footer>
  );
}
