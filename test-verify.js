import { runAcademicVerificationTests } from './src/math/tests.js';

console.log('--- EJECUTANDO VERIFICACIÓN ACADÉMICA (10 CASOS) ---');
const results = runAcademicVerificationTests();

results.results.forEach((r) => {
  console.log(`[${r.passed ? 'PASS' : 'FAIL'}] ${r.title}`);
  console.log(`       Esperado: ${r.expected}`);
  console.log(`       Obtenido: ${r.actual}`);
});

console.log(`\nResultado global: ${results.passedCount}/${results.totalCount} pruebas pasadas.`);

if (results.allPassed) {
  console.log('✅ TODAS LAS PRUEBAS PASARON EXITOSAMENTE.');
  process.exit(0);
} else {
  console.error('❌ ALGUNAS PRUEBAS FALLARON.');
  process.exit(1);
}
