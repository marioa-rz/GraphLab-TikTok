# GraphLab TikTok — Simulador Interactivo de Teoría de Grafos y Recomendaciones

> **Universidad Mariano Gálvez de Guatemala**  
> **Facultad de Ingeniería en Sistemas**  
> **Curso:** Matemática Discreta  
> **Docente:** Ing. Walter Alvarez  
> **Sección:** E  
> **Fecha de entrega:** 23 de octubre de 2026  

---

### Integrantes del Proyecto
| Estudiante | Carné | Participación |
| :--- | :---: | :---: |
| **Mario Andreé Rodríguez Zamboni** | 9490-26-5548 | 100% |
| **Daniel Isaac Colindres Palala** | 9490-24-22720 | 100% |
| **Kenneth Rolando Agustín Aragón** | 9490-26-592 | 100% |

---

## 📌 1. Introducción y Tema Central

El proyecto **GraphLab TikTok** es una aplicación web académica, interactiva y visual diseñada para simular y explicar el tema:

> **«Aplicación de la teoría de grafos en los sistemas de recomendación de TikTok y su relación con el consumo repetitivo de contenido»**

El objetivo principal es materializar los conceptos fundamentales de Matemática Discreta mediante un laboratorio interactivo que permita a estudiantes y docentes:
1. Modificar las conexiones de un grafo en tiempo real.
2. Observar cómo se recalculan automáticamente los grados de los vértices.
3. Verificar matemáticamente el **Lema del Apretón de Manos** de Euler ($\sum_{v \in W} \deg(v) = 2 \cdot |E|$).
4. Analizar **trayectorias de longitud 2** entre usuarios para detectar afinidades comunes.
5. Generar **recomendaciones de contenido** mediante trayectorias didácticas de longitud 3 basadas en intereses compartidos.
6. Simular la evolución del grafo al añadir una nueva interacción (como el «Me gusta» del usuario A al video V3) y comparar visualmente el **Antes / Después**.
7. Comprender la relación del modelo con el bucle de retroalimentación en el consumo digital, manteniendo una estricta rigurosidad académica sin emitir diagnósticos clínicos de adicción.

---

## 📐 2. Modelo Matemático y Datos Iniciales

El grafo inicial cargado por defecto corresponde exactamente al modelo presentado en el informe académico:

### Particiones Disjuntas del Grafo Bipartito ($W = U \cup V$)
- **Conjunto de Usuarios:**  
  $$U = \{A, B, C, D\} \quad (|U| = 4)$$
- **Conjunto de Videos:**  
  $$V = \{V_1, V_2, V_3, V_4, V_5\} \quad (|V| = 5)$$
  - **$V_1$:** Videos de gatos (Felinos)
  - **$V_2$:** Videos de perros (Caninos)
  - **$V_3$:** Mascotas graciosas (Humor animal)
  - **$V_4$:** Animales domésticos (Hogar)
  - **$V_5$:** Curiosidades de animales (Educativo)
- **Vértices Totales:**  
  $$|W| = |U| + |V| = 4 + 5 = 9 \text{ vértices}$$

### Conjunto de Aristas Iniciales ($E$)
Una arista representa una interacción directa de «Me gusta»:
$$E = \{(A, V_1), (A, V_2), (B, V_1), (B, V_2), (B, V_3), (C, V_3), (C, V_4), (D, V_4), (D, V_5)\} \quad (|E| = 9)$$

### Propiedades Topológicas
- **Grafo simple:** No posee lazos ni aristas múltiples.
- **No dirigido:** Las relaciones de agrado son simétricas en el modelo.
- **Grafo bipartito:** $E \subseteq U \times V$. No existen aristas $U-U$ ni $V-V$.

### Grados de los Vértices Iniciales
- **Usuarios:** $\deg(A) = 2$, $\deg(B) = 3$, $\deg(C) = 2$, $\deg(D) = 2$. ($\sum \deg(u) = 9$)
- **Videos:** $\deg(V_1) = 2$, $\deg(V_2) = 2$, $\deg(V_3) = 2$, $\deg(V_4) = 2$, $\deg(V_5) = 1$. ($\sum \deg(v) = 9$)
- **Suma Total:** $9 + 9 = 18$.
- **Lema del Apretón de Manos:** $18 = 2 \times 9 = 18$ *(Comprobación satisfecha)*.

---

## 🎯 3. Algoritmo Heurístico de Recomendaciones

Para un usuario objetivo $U$ y un video candidato $V \notin \text{liked}(U)$:
$$\text{Puntuación}(U, V) = \sum_{U' \in \text{interactors}(V),\, U' \neq U} |\text{liked}(U) \cap \text{liked}(U')|$$

### Ejemplo Académico:
1. Al usuario **A** le gustan: $\{V_1, V_2\}$.
2. Al usuario **B** le gustan: $\{V_1, V_2, V_3\}$.
3. $A$ y $B$ comparten 2 videos ($V_1$ y $V_2$).
4. El video $V_3$ no ha sido visto por $A$, pero recibió Me gusta de $B$ (aporta 2 puntos) y de $C$ (comparte 0 con $A$).
5. **Resultado:** Se recomienda **$V_3$ al usuario $A$** con puntuación 2 y trayectoria justificativa:
   $$A \to V_1 \to B \to V_3 \quad (\text{longitud } 3)$$

---

## 🚀 4. Secciones Principales de la Aplicación

1. **A. Inicio:** Portada tecnológica, resumen de métricas en tiempo real, lienzo del grafo interactivo y tarjetas con los conceptos de clase.
2. **B. Simulación Guiada:** Experimento paso a paso en 8 etapas estructuradas para la exposición universitaria (con controles Anterior, Siguiente y Reiniciar).
3. **C. Laboratorio Interactivo:** Espacio de experimentación abierta con soporte CRUD completo (crear/eliminar usuarios y videos, registrar conexiones, buscar trayectorias BFS, inspeccionar nodos y simular Me gusta con comparador Antes/Después).
4. **D. Fundamentos Matemáticos:** Enciclopedia visual con definiciones rigurosas, analogías sencillas («en palabras simples») y una **batería automatizada de 10 pruebas unitarias**.
5. **E. Modo Exposición:** Vista optimizada para proyectores universitarios, navegación por teclado (`←`, `→`, `Espacio`, `F` para pantalla completa) y una **pregunta interactiva para la audiencia** con justificación visual en el grafo.
6. **Gestor de Escenarios:** 6 escenarios preconfigurados (Proyecto original, Cold Start de usuario nuevo, Video viral, Comunidades separadas, Personalización progresiva y Lienzo en blanco) junto a exportación/importación en formato JSON.

---

## 🛠️ 5. Tecnologías Utilizadas

- **Framework:** React 18 con Vite 6.
- **Visualización de Grafos:** `@xyflow/react` (React Flow) con nodos y aristas SVG personalizadas.
- **Iconografía:** `lucide-react`.
- **Efectos y Celebraciones Didácticas:** `canvas-confetti`.
- **Estilos:** CSS3 moderno con variables personalizadas, Grid y Flexbox (sin librerías pesadas innecesarias).
- **Persistencia:** Almacenamiento local mediante `localStorage`.

---

## 💻 6. Instalación y Ejecución Local

### Prerrequisitos
- Node.js (versión 18 o superior).
- npm (versión 9 o superior).

### Pasos

1. **Clonar o abrir el repositorio en la terminal:**
   ```bash
   cd Proyecto_MatematicaDis
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre tu navegador en [http://localhost:3000](http://localhost:3000).

4. **Ejecutar la suite de pruebas matemáticas:**
   ```bash
   npm test
   ```
   Verifica automáticamente los 10 casos de prueba académica (10/10 PASS).

5. **Compilar para producción:**
   ```bash
   npm run build
   ```
   Los archivos estáticos optimizados se generarán en la carpeta `dist/`.

---

## ☁️ 7. Instrucciones para Despliegue

La aplicación es 100% estática (Client-Side) y no requiere ningún servidor ni base de datos, lo que permite desplegarla gratuitamente en segundos:

### Despliegue en Cloudflare Pages
1. Inicia sesión en [Cloudflare Dashboard](https://dash.cloudflare.com/) y dirígete a **Workers & Pages** > **Create application** > **Pages**.
2. Conecta tu repositorio de GitHub (o sube directamente la carpeta `dist` mediante *Direct Upload*).
3. Configuración de compilación:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Haz clic en **Save and Deploy**. En menos de un minuto tu simulador estará en línea con dominio `.pages.dev`.

### Despliegue en Vercel
1. Instala el CLI de Vercel (`npm i -g vercel`) o importa el repositorio desde [vercel.com](https://vercel.com).
2. Vercel detectará automáticamente que es un proyecto Vite:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Haz clic en **Deploy**.

---

## 📚 8. Referencias Bibliográficas

- Galanis, P., Katsiroumpa, A., Katsiroumpa, Z., Mangoulia, P., Gallos, P., Moisoglou, I., & Koukia, E. (2025). Association between problematic TikTok use and mental health: A systematic review and meta-analysis. *AIMS Public Health*, 12(2), 491–519. https://doi.org/10.3934/publichealth.2025027
- TikTok. (s. f.). *Cómo recomienda contenido TikTok*. Centro de ayuda oficial. https://support.tiktok.com/es/using-tiktok/exploring-videos/how-tiktok-recommends-content
- Universidad Mariano Gálvez de Guatemala. (2026). *Matemática Discreta: Teoría de grafos*. Material de clase del 26 de septiembre de 2026 y ejercicios en clase del 3 de octubre de 2026. Facultad de Ingeniería en Sistemas.

---
© 2026 Universidad Mariano Gálvez de Guatemala — Facultad de Ingeniería en Sistemas.
