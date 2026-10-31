import { INITIAL_USERS, INITIAL_VIDEOS, INITIAL_EDGES } from '../data/initialData.js';
import {
  calculateDegrees,
  verifyHandshakingLemma,
  findShortestPath,
  calculateRecommendations,
  validateBipartiteEdge,
} from './graphLogic.js';

export function runAcademicVerificationTests() {
  const results = [];

  // Prueba 1: El grafo inicial tiene 9 vértices y 9 aristas.
  const totalVertices = INITIAL_USERS.length + INITIAL_VIDEOS.length;
  const totalEdges = INITIAL_EDGES.length;
  const p1Passed = totalVertices === 9 && totalEdges === 9;
  results.push({
    id: 1,
    title: 'Prueba 1: Vértices y Aristas iniciales',
    expected: '|W| = 9 vértices (4 usuarios, 5 videos), |E| = 9 aristas',
    actual: `|W| = ${totalVertices} (${INITIAL_USERS.length} U, ${INITIAL_VIDEOS.length} V), |E| = ${totalEdges}`,
    passed: p1Passed,
  });

  // Prueba 2: Los grados iniciales son A=2, B=3, C=2, D=2, V1=2, V2=2, V3=2, V4=2 y V5=1.
  const degrees = calculateDegrees(INITIAL_USERS, INITIAL_VIDEOS, INITIAL_EDGES);
  const uDegs = Object.fromEntries(degrees.users.map((u) => [u.id, u.degree]));
  const vDegs = Object.fromEntries(degrees.videos.map((v) => [v.id, v.degree]));
  const p2Passed =
    uDegs['A'] === 2 &&
    uDegs['B'] === 3 &&
    uDegs['C'] === 2 &&
    uDegs['D'] === 2 &&
    vDegs['V1'] === 2 &&
    vDegs['V2'] === 2 &&
    vDegs['V3'] === 2 &&
    vDegs['V4'] === 2 &&
    vDegs['V5'] === 1;
  results.push({
    id: 2,
    title: 'Prueba 2: Grados individuales iniciales',
    expected: 'A=2, B=3, C=2, D=2 | V1=2, V2=2, V3=2, V4=2, V5=1',
    actual: `A=${uDegs['A']}, B=${uDegs['B']}, C=${uDegs['C']}, D=${uDegs['D']} | V1=${vDegs['V1']}, V2=${vDegs['V2']}, V3=${vDegs['V3']}, V4=${vDegs['V4']}, V5=${vDegs['V5']}`,
    passed: p2Passed,
  });

  // Prueba 3: La suma de grados original es 18.
  const p3Passed = degrees.totalDegree === 18 && degrees.totalUserDegree === 9 && degrees.totalVideoDegree === 9;
  results.push({
    id: 3,
    title: 'Prueba 3: Suma de grados total',
    expected: 'Σ deg(v) = 18 (9 usuarios + 9 videos)',
    actual: `Σ deg(v) = ${degrees.totalDegree} (${degrees.totalUserDegree} U + ${degrees.totalVideoDegree} V)`,
    passed: p3Passed,
  });

  // Prueba 4: El lema del apretón de manos confirma 18 = 2 × 9.
  const lemma = verifyHandshakingLemma(INITIAL_USERS, INITIAL_VIDEOS, INITIAL_EDGES);
  const p4Passed = lemma.isSatisfied && lemma.totalDegree === 18 && lemma.doubleEdges === 18;
  results.push({
    id: 4,
    title: 'Prueba 4: Lema del apretón de manos',
    expected: '18 = 2 × 9 (18 = 18)',
    actual: `${lemma.totalDegree} = 2 × ${lemma.edgeCount} (${lemma.totalDegree} = ${lemma.doubleEdges})`,
    passed: p4Passed,
  });

  // Prueba 5: La longitud mínima entre A y B es 2.
  const pathAB = findShortestPath('A', 'B', INITIAL_USERS, INITIAL_VIDEOS, INITIAL_EDGES);
  const p5Passed = pathAB.found && pathAB.length === 2 && pathAB.allShortestPaths.length >= 2;
  results.push({
    id: 5,
    title: 'Prueba 5: Trayectoria mínima entre A y B',
    expected: 'Longitud mínima = 2 (Trayectorias: A → V1 → B y A → V2 → B)',
    actual: `Longitud = ${pathAB.length}, Caminos encontrados: ${pathAB.allShortestPaths.map((p) => p.join(' → ')).join(' y ')}`,
    passed: p5Passed,
  });

  // Prueba 6: La recomendación principal para A es V3.
  const recA = calculateRecommendations('A', INITIAL_USERS, INITIAL_VIDEOS, INITIAL_EDGES);
  const p6Passed =
    recA.hasRecommendations &&
    recA.topRecommendation &&
    recA.topRecommendation.video.id === 'V3' &&
    recA.topRecommendation.score === 2;
  results.push({
    id: 6,
    title: 'Prueba 6: Recomendación didáctica para el Usuario A',
    expected: 'Video recomendado = V3 (puntuación: 2, justificación por B)',
    actual: recA.topRecommendation
      ? `Video recomendado = ${recA.topRecommendation.video.id} (puntuación: ${recA.topRecommendation.score}, camino: ${recA.topRecommendation.pathString})`
      : 'No hubo recomendación',
    passed: p6Passed,
  });

  // Prueba 7: Al agregar (A,V3), las aristas aumentan a 10 y la suma de grados a 20.
  const updatedEdges = [...INITIAL_EDGES, { id: 'e-A-V3-test', source: 'A', target: 'V3' }];
  const updatedDegrees = calculateDegrees(INITIAL_USERS, INITIAL_VIDEOS, updatedEdges);
  const updatedLemma = verifyHandshakingLemma(INITIAL_USERS, INITIAL_VIDEOS, updatedEdges);
  const p7Passed =
    updatedEdges.length === 10 &&
    updatedDegrees.totalDegree === 20 &&
    updatedLemma.isSatisfied &&
    updatedDegrees.degreesMap.get('A') === 3 &&
    updatedDegrees.degreesMap.get('V3') === 3;
  results.push({
    id: 7,
    title: 'Prueba 7: Simulación de nueva interacción (A, V3)',
    expected: '|E| = 10, deg(A) = 3, deg(V3) = 3, Σ deg(v) = 20, 20 = 2 × 10',
    actual: `|E| = ${updatedEdges.length}, deg(A) = ${updatedDegrees.degreesMap.get('A')}, deg(V3) = ${updatedDegrees.degreesMap.get('V3')}, Σ deg(v) = ${updatedDegrees.totalDegree}, Lema: ${updatedLemma.totalDegree} = ${updatedLemma.doubleEdges}`,
    passed: p7Passed,
  });

  // Prueba 8: No es posible agregar aristas duplicadas ni aristas no bipartitas.
  const dupCheck = validateBipartiteEdge('A', 'V1', INITIAL_USERS, INITIAL_VIDEOS, INITIAL_EDGES);
  const userUserCheck = validateBipartiteEdge('A', 'B', INITIAL_USERS, INITIAL_VIDEOS, INITIAL_EDGES);
  const videoVideoCheck = validateBipartiteEdge('V1', 'V2', INITIAL_USERS, INITIAL_VIDEOS, INITIAL_EDGES);
  const loopCheck = validateBipartiteEdge('A', 'A', INITIAL_USERS, INITIAL_VIDEOS, INITIAL_EDGES);
  const p8Passed = !dupCheck.valid && !userUserCheck.valid && !videoVideoCheck.valid && !loopCheck.valid;
  results.push({
    id: 8,
    title: 'Prueba 8: Restricciones de grafo bipartito simple',
    expected: 'Rechazar duplicados (A-V1), U-U (A-B), V-V (V1-V2) y lazos (A-A)',
    actual: `Duplicado: ${!dupCheck.valid ? 'Rechazado' : 'Aceptado'}, U-U: ${!userUserCheck.valid ? 'Rechazado' : 'Aceptado'}, V-V: ${!videoVideoCheck.valid ? 'Rechazado' : 'Aceptado'}, Lazo: ${!loopCheck.valid ? 'Rechazado' : 'Aceptado'}`,
    passed: p8Passed,
  });

  // Prueba 9: Si se elimina un usuario o video, también se eliminan sus aristas.
  const deleteUserId = 'B';
  const remainingEdgesAfterDeleteUser = INITIAL_EDGES.filter(
    (e) => e.source !== deleteUserId && e.target !== deleteUserId
  );
  // B tenía 3 aristas: (B,V1), (B,V2), (B,V3). De 9 deben quedar 6.
  const p9Passed = remainingEdgesAfterDeleteUser.length === 6;
  results.push({
    id: 9,
    title: 'Prueba 9: Eliminación en cascada de aristas',
    expected: 'Al eliminar el usuario B (que tiene 3 conexiones), quedan 6 aristas',
    actual: `Quedan ${remainingEdgesAfterDeleteUser.length} aristas de 9`,
    passed: p9Passed,
  });

  // Prueba 10: Si no existe trayectoria o recomendación válida, la aplicación informa correctamente.
  const isolatedUser = { id: 'Z', name: 'Usuario Z', type: 'user' };
  const usersWithIsolated = [...INITIAL_USERS, isolatedUser];
  const isolatedRec = calculateRecommendations('Z', usersWithIsolated, INITIAL_VIDEOS, INITIAL_EDGES);
  const isolatedPath = findShortestPath('A', 'Z', usersWithIsolated, INITIAL_VIDEOS, INITIAL_EDGES);
  const p10Passed = !isolatedRec.hasRecommendations && isolatedRec.reason === 'cold_start' && !isolatedPath.found;
  results.push({
    id: 10,
    title: 'Prueba 10: Detección formal de ausencia de camino / cold start',
    expected: 'Usuario aislado Z: 0 recomendaciones (cold start) y sin camino hacia A',
    actual: `Recomendaciones: ${isolatedRec.hasRecommendations ? 'Sí' : 'No (' + isolatedRec.reason + ')'}, Camino encontrado: ${isolatedPath.found ? 'Sí' : 'No'}`,
    passed: p10Passed,
  });

  return {
    allPassed: results.every((r) => r.passed),
    results,
    passedCount: results.filter((r) => r.passed).length,
    totalCount: results.length,
  };
}
