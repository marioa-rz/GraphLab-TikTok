export const INITIAL_USERS = [
  { id: 'A', name: 'Usuario A', type: 'user', position: { x: 100, y: 70 } },
  { id: 'B', name: 'Usuario B', type: 'user', position: { x: 100, y: 190 } },
  { id: 'C', name: 'Usuario C', type: 'user', position: { x: 100, y: 310 } },
  { id: 'D', name: 'Usuario D', type: 'user', position: { x: 100, y: 430 } },
];

export const INITIAL_VIDEOS = [
  { id: 'V1', name: 'V1', title: 'Videos de gatos', category: 'Felinos', type: 'video', position: { x: 500, y: 60 } },
  { id: 'V2', name: 'V2', title: 'Videos de perros', category: 'Caninos', type: 'video', position: { x: 500, y: 150 } },
  { id: 'V3', name: 'V3', title: 'Mascotas graciosas', category: 'Humor animal', type: 'video', position: { x: 500, y: 240 } },
  { id: 'V4', name: 'V4', title: 'Animales domésticos', category: 'Hogar', type: 'video', position: { x: 500, y: 330 } },
  { id: 'V5', name: 'V5', title: 'Curiosidades de animales', category: 'Educativo', type: 'video', position: { x: 500, y: 420 } },
];

/**
 * Initial set of edges E:
 * (A, V1), (A, V2), (B, V1), (B, V2), (B, V3), (C, V3), (C, V4), (D, V4), (D, V5)
 * Total: 9 edges
 */
export const INITIAL_EDGES = [
  { id: 'e-A-V1', source: 'A', target: 'V1', isInitial: true },
  { id: 'e-A-V2', source: 'A', target: 'V2', isInitial: true },
  { id: 'e-B-V1', source: 'B', target: 'V1', isInitial: true },
  { id: 'e-B-V2', source: 'B', target: 'V2', isInitial: true },
  { id: 'e-B-V3', source: 'B', target: 'V3', isInitial: true },
  { id: 'e-C-V3', source: 'C', target: 'V3', isInitial: true },
  { id: 'e-C-V4', source: 'C', target: 'V4', isInitial: true },
  { id: 'e-D-V4', source: 'D', target: 'V4', isInitial: true },
  { id: 'e-D-V5', source: 'D', target: 'V5', isInitial: true },
];
