import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { INITIAL_USERS, INITIAL_VIDEOS, INITIAL_EDGES } from '../data/initialData';
import { SCENARIOS } from '../data/scenarios';
import {
  calculateDegrees,
  verifyHandshakingLemma,
  calculateRecommendations,
  findShortestPath,
  validateBipartiteEdge,
  normalizeEdge,
} from '../math/graphLogic';

const STORAGE_KEY = 'graphlab_tiktok_state_v1';
const SAVED_SCENARIOS_KEY = 'graphlab_saved_scenarios_v1';

const GraphContext = createContext(null);

export function GraphProvider({ children }) {
  // Estado base del grafo
  const [users, setUsers] = useState(INITIAL_USERS);
  const [videos, setVideos] = useState(INITIAL_VIDEOS);
  const [edges, setEdges] = useState(INITIAL_EDGES);

  // Escenario activo y trazabilidad
  const [currentScenarioId, setCurrentScenarioId] = useState('original');
  const [history, setHistory] = useState([]);

  // Interacción visual y selección
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [highlightedPath, setHighlightedPath] = useState([]);
  const [recommendedNodeId, setRecommendedNodeId] = useState(null);

  // Inspector / Editor modal explícito
  const [isInspectorModalOpen, setIsInspectorModalOpen] = useState(false);
  const [inspectorNodeId, setInspectorNodeId] = useState(null);

  const openNodeInspector = useCallback((nodeId) => {
    if (!nodeId) return;
    setInspectorNodeId(nodeId);
    setSelectedNodeId(nodeId);
    setIsInspectorModalOpen(true);
  }, []);

  const closeNodeInspector = useCallback(() => {
    setIsInspectorModalOpen(false);
    setInspectorNodeId(null);
  }, []);

  // Pestaña activa del Laboratorio ('recommendations' | 'paths' | 'math' | 'cycles')
  const [activeLabTab, setActiveLabTab] = useState('recommendations');

  // Registro de interacción previa para comparador Antes / Después
  const [lastDiff, setLastDiff] = useState(null);

  // Notificaciones y alertas
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  // Guardar estado actual en la pila de historial para permitir Deshacer
  const pushHistorySnapshot = useCallback(() => {
    setHistory((prev) => [
      ...prev.slice(-15), // Máximo 15 estados en historial
      {
        users: JSON.parse(JSON.stringify(users)),
        videos: JSON.parse(JSON.stringify(videos)),
        edges: JSON.parse(JSON.stringify(edges)),
        currentScenarioId,
      },
    ]);
  }, [users, videos, edges, currentScenarioId]);

  // Cálculos matemáticos en tiempo real (siempre sincronizados mediante useMemo)
  const degrees = useMemo(() => {
    return calculateDegrees(users, videos, edges);
  }, [users, videos, edges]);

  const lemma = useMemo(() => {
    return verifyHandshakingLemma(users, videos, edges);
  }, [users, videos, edges]);

  // Grados y vecinos en mapas rápidos
  const nodeDegreesMap = useMemo(() => degrees.degreesMap, [degrees]);

  // Lista de adyacencia de nodos conectados al nodo hovered o seleccionado
  const activeConnectedNodeIds = useMemo(() => {
    const focusId = hoveredNodeId || selectedNodeId;
    if (!focusId) return new Set();

    const set = new Set([focusId]);
    edges.forEach((edge) => {
      if (edge.source === focusId) set.add(edge.target);
      if (edge.target === focusId) set.add(edge.source);
    });
    return set;
  }, [hoveredNodeId, selectedNodeId, edges]);

  // Lista de aristas conectadas al nodo en foco
  const activeConnectedEdgeIds = useMemo(() => {
    const focusId = hoveredNodeId || selectedNodeId;
    if (!focusId) return new Set();

    const set = new Set();
    edges.forEach((edge) => {
      if (edge.source === focusId || edge.target === focusId) {
        set.add(edge.id);
      }
    });
    return set;
  }, [hoveredNodeId, selectedNodeId, edges]);

  // Aristas involucradas en una trayectoria resaltada
  const highlightedEdgeIds = useMemo(() => {
    if (!highlightedPath || highlightedPath.length < 2) return new Set();
    const set = new Set();
    for (let i = 0; i < highlightedPath.length - 1; i++) {
      const u = highlightedPath[i];
      const v = highlightedPath[i + 1];
      const match = edges.find(
        (e) => (e.source === u && e.target === v) || (e.source === v && e.target === u)
      );
      if (match) set.add(match.id);
    }
    return set;
  }, [highlightedPath, edges]);

  // Acciones sobre aristas (interacciones)
  const addEdge = useCallback(
    (sourceId, targetId, isNewSimulation = false) => {
      const validation = validateBipartiteEdge(sourceId, targetId, users, videos, edges);
      if (!validation.valid) {
        showToast(validation.error, 'error');
        return { success: false, error: validation.error };
      }

      pushHistorySnapshot();
      const edgeId = `e-${validation.pair.userId}-${validation.pair.videoId}`;
      const newEdge = {
        id: edgeId,
        source: validation.pair.userId,
        target: validation.pair.videoId,
        isInitial: false,
        isNew: isNewSimulation,
        timestamp: Date.now(),
      };

      setEdges((prev) => [...prev, newEdge]);
      showToast(
        `Interacción registrada: ${validation.pair.userId} le dio «Me gusta» a ${validation.pair.videoId}.`,
        'success'
      );
      return { success: true, edge: newEdge };
    },
    [users, videos, edges, pushHistorySnapshot, showToast]
  );

  const removeEdge = useCallback(
    (edgeId) => {
      const edgeToRemove = edges.find((e) => e.id === edgeId);
      if (!edgeToRemove) return;

      pushHistorySnapshot();
      setEdges((prev) => prev.filter((e) => e.id !== edgeId));
      showToast(`Interacción eliminada (${edgeToRemove.source} ↔ ${edgeToRemove.target}).`, 'info');
      if (selectedEdgeId === edgeId) setSelectedEdgeId(null);
    },
    [edges, selectedEdgeId, pushHistorySnapshot, showToast]
  );

  // Simulación guiada de nueva interacción (A, V3) con registro de diff
  const simulateLike = useCallback(
    (userId, videoId) => {
      // Capturar estado previo
      const beforeDegrees = calculateDegrees(users, videos, edges);
      const beforeEdgesCount = edges.length;
      const beforeTotalDegree = beforeDegrees.totalDegree;
      const beforeUserDeg = beforeDegrees.degreesMap.get(userId) || 0;
      const beforeVideoDeg = beforeDegrees.degreesMap.get(videoId) || 0;

      const result = addEdge(userId, videoId, true);
      if (result.success) {
        setLastDiff({
          userId,
          videoId,
          before: {
            edgesCount: beforeEdgesCount,
            userDegree: beforeUserDeg,
            videoDegree: beforeVideoDeg,
            totalDegree: beforeTotalDegree,
          },
          after: {
            edgesCount: beforeEdgesCount + 1,
            userDegree: beforeUserDeg + 1,
            videoDegree: beforeVideoDeg + 1,
            totalDegree: beforeTotalDegree + 2,
          },
        });
        // Resaltar los nodos y la arista
        setHighlightedPath([userId, videoId]);
        setRecommendedNodeId(null);
      }
      return result;
    },
    [users, videos, edges, addEdge]
  );

  // Acciones sobre usuarios
  const addUser = useCallback(
    (name, customId) => {
      const id = customId?.trim().toUpperCase() || `U${users.length + 1}`;
      if (users.some((u) => u.id === id) || videos.some((v) => v.id === id)) {
        showToast(`El identificador "${id}" ya está en uso.`, 'error');
        return false;
      }

      pushHistorySnapshot();
      const nextY = 70 + users.length * 100;
      const newUser = {
        id,
        name: name || `Usuario ${id}`,
        type: 'user',
        position: { x: 100, y: nextY },
      };

      setUsers((prev) => [...prev, newUser]);
      showToast(`Usuario ${id} creado exitosamente.`, 'success');
      return true;
    },
    [users, videos, pushHistorySnapshot, showToast]
  );

  const deleteUser = useCallback(
    (userId) => {
      pushHistorySnapshot();
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      // Eliminación en cascada de sus aristas
      setEdges((prev) => prev.filter((e) => e.source !== userId && e.target !== userId));
      if (selectedNodeId === userId) setSelectedNodeId(null);
      showToast(`Usuario ${userId} y sus conexiones fueron eliminados.`, 'info');
    },
    [selectedNodeId, pushHistorySnapshot, showToast]
  );

  const updateUser = useCallback(
    (userId, newName) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, name: newName || u.name } : u))
      );
      showToast(`Información del usuario ${userId} actualizada.`, 'info');
    },
    [showToast]
  );

  // Acciones sobre videos
  const addVideo = useCallback(
    (customId, title, category) => {
      const id = customId?.trim().toUpperCase() || `V${videos.length + 1}`;
      if (videos.some((v) => v.id === id) || users.some((u) => u.id === id)) {
        showToast(`El identificador "${id}" ya está en uso.`, 'error');
        return false;
      }

      pushHistorySnapshot();
      const nextY = 60 + videos.length * 90;
      const newVideo = {
        id,
        name: id,
        title: title || `Nuevo Video ${id}`,
        category: category || 'General',
        type: 'video',
        position: { x: 500, y: nextY },
      };

      setVideos((prev) => [...prev, newVideo]);
      showToast(`Video ${id} agregado exitosamente.`, 'success');
      return true;
    },
    [users, videos, pushHistorySnapshot, showToast]
  );

  const deleteVideo = useCallback(
    (videoId) => {
      pushHistorySnapshot();
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
      // Eliminación en cascada de aristas
      setEdges((prev) => prev.filter((e) => e.source !== videoId && e.target !== videoId));
      if (selectedNodeId === videoId) setSelectedNodeId(null);
      showToast(`Video ${videoId} y sus conexiones fueron eliminados.`, 'info');
    },
    [selectedNodeId, pushHistorySnapshot, showToast]
  );

  const updateVideo = useCallback(
    (videoId, newTitle, newCategory) => {
      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId
            ? { ...v, title: newTitle || v.title, category: newCategory || v.category }
            : v
        )
      );
      showToast(`Video ${videoId} actualizado.`, 'info');
    },
    [showToast]
  );

  // Deshacer última acción
  const undoLastAction = useCallback(() => {
    if (history.length === 0) {
      showToast('No hay acciones previas para deshacer.', 'info');
      return;
    }

    const previousState = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setUsers(previousState.users);
    setVideos(previousState.videos);
    setEdges(previousState.edges);
    setCurrentScenarioId(previousState.currentScenarioId);
    setHighlightedPath([]);
    setRecommendedNodeId(null);
    setLastDiff(null);
    showToast('Última acción revertida.', 'info');
  }, [history, showToast]);

  // Carga de escenarios
  const loadScenario = useCallback(
    (scenarioId) => {
      const target = SCENARIOS.find((s) => s.id === scenarioId);
      if (!target) return;

      pushHistorySnapshot();
      setUsers(JSON.parse(JSON.stringify(target.users)));
      setVideos(JSON.parse(JSON.stringify(target.videos)));
      setEdges(JSON.parse(JSON.stringify(target.edges)));
      setCurrentScenarioId(scenarioId);
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      setHighlightedPath([]);
      setRecommendedNodeId(null);
      setLastDiff(null);
      showToast(`Escenario cargado: ${target.name}`, 'success');
    },
    [pushHistorySnapshot, showToast]
  );

  // Restaurar datos originales del proyecto
  const resetToOriginal = useCallback(() => {
    pushHistorySnapshot();
    setUsers(JSON.parse(JSON.stringify(INITIAL_USERS)));
    setVideos(JSON.parse(JSON.stringify(INITIAL_VIDEOS)));
    setEdges(JSON.parse(JSON.stringify(INITIAL_EDGES)));
    setCurrentScenarioId('original');
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setHighlightedPath([]);
    setRecommendedNodeId(null);
    setLastDiff(null);
    showToast('Grafo original del proyecto restaurado (4 usuarios, 5 videos, 9 aristas).', 'success');
  }, [pushHistorySnapshot, showToast]);

  // Limpiar grafo completamente
  const clearGraph = useCallback(() => {
    pushHistorySnapshot();
    setUsers([]);
    setVideos([]);
    setEdges([]);
    setCurrentScenarioId('empty_sandbox');
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setHighlightedPath([]);
    setRecommendedNodeId(null);
    setLastDiff(null);
    showToast('Grafo vaciado. Listo para experimentar desde cero.', 'info');
  }, [pushHistorySnapshot, showToast]);

  // Reorganizar visualmente en columnas bipartitas limpias
  const resetNodeDistribution = useCallback(() => {
    setUsers((prev) =>
      prev.map((u, index) => ({
        ...u,
        position: { x: 100, y: 70 + index * 105 },
      }))
    );
    setVideos((prev) =>
      prev.map((v, index) => ({
        ...v,
        position: { x: 500, y: 60 + index * 90 },
      }))
    );
    showToast('Distribución bipartita restaurada (Usuarios a la izquierda, Videos a la derecha).', 'info');
  }, [showToast]);

  // Actualizar posición de nodo arrastrado
  const updateNodePosition = useCallback((nodeId, position) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === nodeId ? { ...u, position } : u))
    );
    setVideos((prev) =>
      prev.map((v) => (v.id === nodeId ? { ...v, position } : v))
    );
  }, []);

  // Exportar grafo a JSON
  const exportToJson = useCallback(() => {
    const data = {
      version: '1.0',
      academicProject: 'GraphLab TikTok - UMG',
      timestamp: new Date().toISOString(),
      scenarioId: currentScenarioId,
      users,
      videos,
      edges,
    };
    return JSON.stringify(data, null, 2);
  }, [currentScenarioId, users, videos, edges]);

  // Importar grafo desde JSON con validación estricta de estructura bipartita
  const importFromJson = useCallback(
    (jsonString) => {
      try {
        const parsed = JSON.parse(jsonString);
        if (!Array.isArray(parsed.users) || !Array.isArray(parsed.videos) || !Array.isArray(parsed.edges)) {
          throw new Error('El archivo JSON no contiene listas válidas de usuarios, videos y aristas.');
        }

        // Validar que cada arista una un usuario con un video
        for (const edge of parsed.edges) {
          const pair = normalizeEdge(edge.source, edge.target, parsed.users, parsed.videos);
          if (!pair) {
            throw new Error(
              `Estructura inválida: la arista (${edge.source}, ${edge.target}) no cumple la propiedad bipartita Usuario ↔ Video.`
            );
          }
        }

        pushHistorySnapshot();
        setUsers(parsed.users);
        setVideos(parsed.videos);
        setEdges(parsed.edges);
        setCurrentScenarioId('imported_custom');
        showToast('Escenario JSON importado exitosamente.', 'success');
        return { success: true };
      } catch (err) {
        showToast(`Error al importar: ${err.message}`, 'error');
        return { success: false, error: err.message };
      }
    },
    [pushHistorySnapshot, showToast]
  );

  return (
    <GraphContext.Provider
      value={{
        users,
        videos,
        edges,
        history,
        degrees,
        lemma,
        nodeDegreesMap,
        currentScenarioId,
        selectedNodeId,
        selectedEdgeId,
        hoveredNodeId,
        highlightedPath,
        recommendedNodeId,
        isInspectorModalOpen,
        setIsInspectorModalOpen,
        inspectorNodeId,
        setInspectorNodeId,
        openNodeInspector,
        closeNodeInspector,
        activeLabTab,
        setActiveLabTab,
        activeConnectedNodeIds,
        activeConnectedEdgeIds,
        highlightedEdgeIds,
        lastDiff,
        toast,
        showToast,
        closeToast,
        setSelectedNodeId,
        setSelectedEdgeId,
        setHoveredNodeId,
        setHighlightedPath,
        setRecommendedNodeId,
        addEdge,
        removeEdge,
        simulateLike,
        addUser,
        deleteUser,
        updateUser,
        addVideo,
        deleteVideo,
        updateVideo,
        undoLastAction,
        loadScenario,
        resetToOriginal,
        clearGraph,
        resetNodeDistribution,
        updateNodePosition,
        exportToJson,
        importFromJson,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
}

export function useGraph() {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraph debe usarse dentro de un GraphProvider');
  }
  return context;
}
