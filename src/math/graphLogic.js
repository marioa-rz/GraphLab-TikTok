/**
 * GraphLab TikTok - Módulo de Lógica Matemática y Teoría de Grafos
 * Universidad Mariano Gálvez de Guatemala - Matemática Discreta
 */

/**
 * Normaliza y obtiene el par ordenado representativo de una arista usuario-video.
 * En nuestro modelo bipartito no dirigido, una arista conecta un usuario y un video.
 */
export function normalizeEdge(sourceId, targetId, users, videos) {
  const isSourceUser = users.some((u) => u.id === sourceId);
  const isTargetVideo = videos.some((v) => v.id === targetId);

  if (isSourceUser && isTargetVideo) {
    return { userId: sourceId, videoId: targetId };
  }

  const isSourceVideo = videos.some((v) => v.id === sourceId);
  const isTargetUser = users.some((u) => u.id === targetId);

  if (isSourceVideo && isTargetUser) {
    return { userId: targetId, videoId: sourceId };
  }

  return null;
}

/**
 * Valida si se puede agregar una nueva conexión manteniendo las propiedades
 * de grafo simple, bipartito y sin lazos.
 */
export function validateBipartiteEdge(sourceId, targetId, users, videos, existingEdges) {
  if (!sourceId || !targetId) {
    return { valid: false, error: 'Debe seleccionar dos vértices.' };
  }

  if (sourceId === targetId) {
    return { valid: false, error: 'No se permiten lazos (un vértice conectado consigo mismo).' };
  }

  const pair = normalizeEdge(sourceId, targetId, users, videos);
  if (!pair) {
    const isBothUsers = users.some((u) => u.id === sourceId) && users.some((u) => u.id === targetId);
    const isBothVideos = videos.some((v) => v.id === sourceId) && videos.some((v) => v.id === targetId);

    if (isBothUsers) {
      return {
        valid: false,
        error: 'Conexión inválida: el modelo es bipartito. No se permiten aristas entre dos usuarios (U-U).',
      };
    }
    if (isBothVideos) {
      return {
        valid: false,
        error: 'Conexión inválida: el modelo es bipartito. No se permiten aristas entre dos videos (V-V).',
      };
    }
    return { valid: false, error: 'Uno de los vértices no existe en la red.' };
  }

  // Verificar si ya existe la arista (evitar multigrafos / aristas repetidas)
  const exists = existingEdges.some((edge) => {
    const ep = normalizeEdge(edge.source, edge.target, users, videos);
    return ep && ep.userId === pair.userId && ep.videoId === pair.videoId;
  });

  if (exists) {
    return {
      valid: false,
      error: `La interacción entre ${pair.userId} y ${pair.videoId} ya existe en el grafo.`,
    };
  }

  return { valid: true, pair };
}

/**
 * Construye la lista de adyacencia no dirigida del grafo completo W = U ∪ V.
 */
export function buildAdjacencyList(users, videos, edges) {
  const adj = new Map();

  users.forEach((u) => adj.set(u.id, []));
  videos.forEach((v) => adj.set(v.id, []));

  edges.forEach((edge) => {
    const pair = normalizeEdge(edge.source, edge.target, users, videos);
    if (pair) {
      if (adj.has(pair.userId) && !adj.get(pair.userId).includes(pair.videoId)) {
        adj.get(pair.userId).push(pair.videoId);
      }
      if (adj.has(pair.videoId) && !adj.get(pair.videoId).includes(pair.userId)) {
        adj.get(pair.videoId).push(pair.userId);
      }
    }
  });

  return adj;
}

/**
 * Calcula los grados de todos los vértices del grafo.
 * Retorna estadísticas de usuarios, videos y explicaciones pedagógicas.
 */
export function calculateDegrees(users, videos, edges) {
  const adj = buildAdjacencyList(users, videos, edges);

  const userDegrees = users.map((u) => {
    const neighbors = adj.get(u.id) || [];
    const degree = neighbors.length;
    let explanation = '';

    if (degree === 0) {
      explanation = `El usuario ${u.name || u.id} tiene grado 0 porque aún no ha interactuado con ningún video.`;
    } else {
      const videoList = neighbors.join(', ');
      explanation = `El usuario ${u.name || u.id} tiene grado ${degree} porque interactuó con ${videoList}.`;
    }

    return {
      id: u.id,
      name: u.name || u.id,
      type: 'user',
      degree,
      neighbors,
      explanation,
    };
  });

  const videoDegrees = videos.map((v) => {
    const neighbors = adj.get(v.id) || [];
    const degree = neighbors.length;
    let explanation = '';

    if (degree === 0) {
      explanation = `El video ${v.id} (${v.title}) tiene grado 0 porque ningún usuario le ha dado Me gusta.`;
    } else {
      const userList = neighbors.join(', ');
      explanation = `El video ${v.id} (${v.title}) tiene grado ${degree} porque recibió Me gusta de los usuarios ${userList}.`;
    }

    return {
      id: v.id,
      name: v.name || v.id,
      title: v.title,
      category: v.category,
      type: 'video',
      degree,
      neighbors,
      explanation,
    };
  });

  const totalUserDegree = userDegrees.reduce((sum, u) => sum + u.degree, 0);
  const totalVideoDegree = videoDegrees.reduce((sum, v) => sum + v.degree, 0);
  const totalDegree = totalUserDegree + totalVideoDegree;

  return {
    users: userDegrees,
    videos: videoDegrees,
    totalUserDegree,
    totalVideoDegree,
    totalDegree,
    degreesMap: new Map([
      ...userDegrees.map((u) => [u.id, u.degree]),
      ...videoDegrees.map((v) => [v.id, v.degree]),
    ]),
  };
}

/**
 * Comprueba dinámicamente el Lema del Apretón de Manos (Handshaking Lemma):
 * Sum(deg(v)) = 2 * |E|
 */
export function verifyHandshakingLemma(users, videos, edges) {
  const {
    users: userDegrees,
    videos: videoDegrees,
    totalUserDegree,
    totalVideoDegree,
    totalDegree,
  } = calculateDegrees(users, videos, edges);

  const edgeCount = edges.length;
  const doubleEdges = 2 * edgeCount;
  const isSatisfied = totalDegree === doubleEdges;

  // En un grafo bipartito no dirigido, la suma de grados de una partición es igual al número de aristas
  const isBipartiteBalanced = totalUserDegree === edgeCount && totalVideoDegree === edgeCount;

  return {
    userDegrees,
    videoDegrees,
    totalUserDegree,
    totalVideoDegree,
    totalDegree,
    edgeCount,
    doubleEdges,
    isSatisfied,
    isBipartiteBalanced,
    formulaText: `Σ deg(v) = 2 · |E|`,
    substitutedText: `${totalDegree} = 2 · ${edgeCount}`,
    userSumText: userDegrees.map((u) => u.degree).join(' + ') + ` = ${totalUserDegree}`,
    videoSumText: videoDegrees.map((v) => v.degree).join(' + ') + ` = ${totalVideoDegree}`,
    totalSumText: `${totalUserDegree} + ${totalVideoDegree} = ${totalDegree}`,
    explanation:
      'Cada arista conecta exactamente un usuario con un video, por lo que cada conexión aporta 1 al grado del usuario y 1 al grado del video (se cuenta dos veces en la suma total).',
  };
}

/**
 * Búsqueda en Anchura (BFS) para encontrar la trayectoria más corta entre dos vértices.
 * Retorna además todas las trayectorias mínimas si existen caminos alternativos de igual longitud.
 */
export function findShortestPath(startId, targetId, users, videos, edges) {
  if (!startId || !targetId) {
    return { found: false, message: 'Debe seleccionar origen y destino.' };
  }

  if (startId === targetId) {
    return {
      found: true,
      length: 0,
      path: [startId],
      allShortestPaths: [[startId]],
      message: 'El vértice de origen y destino son el mismo (longitud 0).',
    };
  }

  const adj = buildAdjacencyList(users, videos, edges);

  if (!adj.has(startId) || !adj.has(targetId)) {
    return {
      found: false,
      message: 'Uno de los vértices no existe en la red actual.',
    };
  }

  // BFS para encontrar caminos mínimos
  const queue = [[startId]];
  const visitedDistances = new Map();
  visitedDistances.set(startId, 0);

  const allShortestPaths = [];
  let shortestLength = Infinity;

  while (queue.length > 0) {
    const currentPath = queue.shift();
    const currentNode = currentPath[currentPath.length - 1];
    const currentDist = currentPath.length - 1;

    if (currentDist > shortestLength) {
      break;
    }

    if (currentNode === targetId) {
      if (currentDist < shortestLength) {
        shortestLength = currentDist;
        allShortestPaths.length = 0;
      }
      allShortestPaths.push(currentPath);
      continue;
    }

    const neighbors = adj.get(currentNode) || [];
    for (const neighbor of neighbors) {
      const neighborDist = visitedDistances.get(neighbor);
      if (neighborDist === undefined || neighborDist >= currentDist + 1) {
        visitedDistances.set(neighbor, currentDist + 1);
        queue.push([...currentPath, neighbor]);
      }
    }
  }

  if (allShortestPaths.length === 0) {
    return {
      found: false,
      startId,
      targetId,
      length: null,
      path: [],
      allShortestPaths: [],
      message: `No existe trayectoria que conecte ${startId} con ${targetId}. Pertenecen a componentes disjuntas o no tienen interacciones intermedias.`,
    };
  }

  const primaryPath = allShortestPaths[0];

  return {
    found: true,
    startId,
    targetId,
    length: shortestLength,
    path: primaryPath,
    allShortestPaths,
    pathString: primaryPath.join(' → '),
    edgeCount: shortestLength,
    message: `Trayectoria encontrada con longitud ${shortestLength} (${shortestLength} aristas recorridas).`,
  };
}

/**
 * Algoritmo Heurístico de Recomendaciones Basado en Intereses Compartidos.
 * 
 * Regla académica especificada:
 * Para un usuario objetivo U y un video candidato V:
 * Puntuación(U, V) = suma, para cada usuario U' que interactuó con V (U' != U),
 *                   del número de videos que U' tiene en común con U.
 */
export function calculateRecommendations(targetUserId, users, videos, edges) {
  const adj = buildAdjacencyList(users, videos, edges);
  const targetLikedVideos = adj.get(targetUserId) || [];

  const targetUserObj = users.find((u) => u.id === targetUserId);
  if (!targetUserObj) {
    return {
      targetUserId,
      candidates: [],
      hasRecommendations: false,
      message: 'El usuario no existe.',
    };
  }

  // Caso: Usuario en frío (Cold start)
  if (targetLikedVideos.length === 0) {
    return {
      targetUserId,
      targetUser: targetUserObj,
      likedVideos: [],
      sharedUsers: [],
      candidates: [],
      hasRecommendations: false,
      reason: 'cold_start',
      message: `El usuario ${targetUserId} no tiene interacciones previas registradas (grado 0). Sin conexiones previas, el sistema no puede identificar intereses compartidos ni calcular trayectorias de recomendación.`,
    };
  }

  // Identificar usuarios que interactuaron con al menos un video de targetLikedVideos
  const otherUsers = users.filter((u) => u.id !== targetUserId);
  const sharedUsersInfo = [];

  otherUsers.forEach((other) => {
    const otherLiked = adj.get(other.id) || [];
    const commonVideos = targetLikedVideos.filter((vId) => otherLiked.includes(vId));

    if (commonVideos.length > 0) {
      sharedUsersInfo.push({
        userId: other.id,
        userName: other.name || other.id,
        commonVideos,
        commonCount: commonVideos.length,
        allLiked: otherLiked,
      });
    }
  });

  if (sharedUsersInfo.length === 0) {
    return {
      targetUserId,
      targetUser: targetUserObj,
      likedVideos: targetLikedVideos,
      sharedUsers: [],
      candidates: [],
      hasRecommendations: false,
      reason: 'no_shared_users',
      message: `Ningún otro usuario comparte videos en común con el usuario ${targetUserId}. No hay recomendaciones basadas en intereses compartidos.`,
    };
  }

  // Identificar videos candidatos: videos de V que NO han sido vistos por targetUserId
  const candidateVideos = videos.filter((v) => !targetLikedVideos.includes(v.id));
  const scoredCandidates = [];

  candidateVideos.forEach((candidate) => {
    const candidateInteractors = adj.get(candidate.id) || []; // usuarios que le dieron like
    // Filtrar para excluir al usuario objetivo si por alguna razón apareciera
    const validInteractors = candidateInteractors.filter((uid) => uid !== targetUserId);

    let totalScore = 0;
    const contributors = [];

    validInteractors.forEach((interactorId) => {
      const match = sharedUsersInfo.find((su) => su.userId === interactorId);
      if (match) {
        totalScore += match.commonCount;
        contributors.push({
          userId: match.userId,
          userName: match.userName,
          commonVideos: match.commonVideos,
          pointsContributed: match.commonCount,
        });
      }
    });

    if (totalScore > 0) {
      // Determinar la mejor trayectoria de recomendación didáctica: U -> V_común -> U' -> Candidato
      // Elegir el colaborador con más videos en común
      const bestContributor = contributors.reduce((prev, curr) =>
        curr.pointsContributed > prev.pointsContributed ? curr : prev
      );
      const bridgeVideo = bestContributor.commonVideos[0];
      const justificationPath = [targetUserId, bridgeVideo, bestContributor.userId, candidate.id];

      scoredCandidates.push({
        video: candidate,
        score: totalScore,
        contributors,
        justificationPath,
        pathString: justificationPath.join(' → '),
        pathLength: justificationPath.length - 1, // 3 aristas
        explanation: `Como ${targetUserId} y ${bestContributor.userId} mostraron interés común en ${bestContributor.commonVideos.join(', ')} y ${bestContributor.userId} interactuó con ${candidate.id}, este video se sugiere con puntuación ${totalScore}.`,
      });
    }
  });

  // Ordenar candidatos descendentemente por puntuación
  scoredCandidates.sort((a, b) => b.score - a.score);

  return {
    targetUserId,
    targetUser: targetUserObj,
    likedVideos: targetLikedVideos,
    sharedUsers: sharedUsersInfo,
    candidates: scoredCandidates,
    hasRecommendations: scoredCandidates.length > 0,
    topRecommendation: scoredCandidates.length > 0 ? scoredCandidates[0] : null,
    message:
      scoredCandidates.length > 0
        ? `Se generaron ${scoredCandidates.length} recomendación(es) para el usuario ${targetUserId}.`
        : 'No hay recomendaciones basadas en intereses compartidos.',
  };
}
