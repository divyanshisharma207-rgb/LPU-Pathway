/**
 * routeEngine.js – Dijkstra-based Accessible Route Calculator
 * Finds fastest or step-free routes between campus nodes
 */

'use strict';

const RouteEngine = (() => {

  /**
   * Dijkstra's algorithm on the GRAPH
   * @param {string} startId – node ID
   * @param {string} endId   – node ID
   * @param {boolean} stepFree – if true, only use stepFree edges
   * @returns {{ path: string[], edges: object[], totalTime: number } | null}
   */
  function findRoute(startId, endId, mode = 'fastest') {
    if (startId === endId) return null;

    const { GRAPH, NODES, LIFTS } = window.CampusData;
    const isStepFree = (mode === true || mode === 'stepfree' || mode === 'covered');
    const isCovered = (mode === 'covered');

    // Distance map
    const dist = {};
    const prev = {};
    const prevEdge = {};
    const visited = new Set();
    const queue = [];

    Object.keys(GRAPH).forEach(id => {
      dist[id] = Infinity;
    });
    dist[startId] = 0;
    queue.push({ id: startId, cost: 0 });

    while (queue.length > 0) {
      // Extract minimum
      queue.sort((a, b) => a.cost - b.cost);
      const { id: current } = queue.shift();

      if (visited.has(current)) continue;
      visited.add(current);

      if (current === endId) break;

      const edges = GRAPH[current] || [];
      for (const edge of edges) {
        // Step-free or covered mode: skip non-stepFree edges (covered route is also accessible)
        if (isStepFree && !edge.stepFree) continue;

        // Skip broken lifts
        if (isStepFree && edge.lift) {
          const lift = LIFTS[edge.lift];
          if (lift && !lift.operational) continue;
        }

        // Base edge weight
        let edgeWeight = isStepFree
          ? (edge.stepFreeWeight ?? edge.weight)
          : edge.weight;

        // If covered mode: heavily favor covered/sheltered corridors and shaded tree avenues!
        if (isCovered) {
          if (edge.covered || edge.type === 'indoor' || edge.type === 'lift') {
            edgeWeight = edgeWeight * 0.45; // 55% discount for sheltered corridor
          } else if (edge.shaded) {
            edgeWeight = edgeWeight * 0.75; // 25% discount for shaded tree canopy
          } else {
            edgeWeight = edgeWeight * 2.8;  // High penalty for open sun/heavy rain
          }
        }

        const alt = dist[current] + edgeWeight;
        if (alt < dist[edge.to]) {
          dist[edge.to] = alt;
          prev[edge.to] = current;
          prevEdge[edge.to] = edge;
          queue.push({ id: edge.to, cost: alt });
        }
      }
    }

    if (dist[endId] === Infinity) return null; // No path found

    // Reconstruct path
    const path = [];
    const edges = [];
    let cur = endId;
    while (cur !== undefined) {
      path.unshift(cur);
      if (prevEdge[cur]) edges.unshift(prevEdge[cur]);
      cur = prev[cur];
    }

    // Calculate actual real walking time
    const actualTime = edges.reduce((acc, e) => acc + (isStepFree ? (e.stepFreeWeight ?? e.weight) : e.weight), 0);

    return {
      path,
      edges,
      totalTime: actualTime,
      stepFree: isStepFree,
      mode: isCovered ? 'covered' : (isStepFree ? 'stepfree' : 'fastest')
    };
  }

  /**
   * Build human-readable directions from a route
   * @param {object} route – from findRoute()
   * @param {boolean} stepFreeMode
   * @returns {Array<{step, icon, instruction, landmark, type, accessTag, distance}>}
   */
  function buildDirections(route, mode) {
    if (!route) return [];

    const isCoveredMode = (mode === 'covered' || route.mode === 'covered');
    if (!route) return [];

    const { NODES, LIFTS } = window.CampusData;
    const { path, edges, totalTime } = route;
    const directions = [];

    // Step 1: Starting point
    const startNode = NODES[path[0]];
    directions.push({
      step: 1,
      icon: '📍',
      instruction: `Start at ${startNode.label}`,
      landmark: startNode.landmark,
      type: 'start',
      accessTag: null,
      distance: null,
    });

    // Build steps for each edge
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      const fromId = path[i];
      const toId   = path[i + 1];
      const fromNode = NODES[fromId];
      const toNode   = NODES[toId];

      let icon, instruction, accessTag, landmark;

      switch (edge.type) {
        case 'lift': {
          const lift = LIFTS[edge.lift];
          const goingUp = (toNode.floor ?? 0) > (fromNode.floor ?? 0);
          icon = '🛗';
          const floorLabel = toNode.floor !== null ? `Floor ${toNode.floor}` : toNode.label;
          instruction = `Take the lift ${goingUp ? 'up' : 'down'} to ${floorLabel}`;
          landmark = lift
            ? `${lift.label} — ${lift.location}. Press the button for Floor ${toNode.floor}.`
            : edge.landmark || edge.desc;
          accessTag = { type: 'lift', label: '🛗 Lift' };
          break;
        }
        case 'ramp': {
          const goingUp = (toNode.floor ?? 0) > (fromNode.floor ?? 0);
          icon = '♿';
          instruction = `Use the ramp ${goingUp ? 'up' : 'down'} to ${toNode.label}`;
          landmark = edge.landmark || edge.desc;
          accessTag = { type: 'ramp', label: '♿ Ramp' };
          break;
        }
        case 'stairs': {
          const goingUp = (toNode.floor ?? 0) > (fromNode.floor ?? 0);
          icon = '🪜';
          instruction = `Take the stairs ${goingUp ? 'up' : 'down'} to ${toNode.label}`;
          landmark = edge.landmark || edge.desc;
          accessTag = { type: 'stairs', label: '🪜 Stairs' };
          break;
        }
        case 'outdoor':
        default: {
          icon = '🚶';
          instruction = edge.desc || `Walk to ${toNode.label}`;
          landmark = edge.landmark || toNode.landmark;
          accessTag = null;
          break;
        }
      }

      // Estimate distance from time (avg 1.1 m/s walking, lift ~ fixed)
      let distStr = null;
      if (edge.type === 'outdoor') {
        const metres = Math.round(edge.weight * 1.1);
        distStr = metres < 1000 ? `~${metres} m` : `~${(metres/1000).toFixed(1)} km`;
      } else if (edge.type === 'lift') {
        distStr = 'Lift';
      }

      directions.push({
        step: directions.length + 1,
        icon,
        instruction,
        landmark,
        type: edge.type,
        accessTag,
        distance: distStr,
        stepFreeOnly: edge.stepFree,
      });
    }

    // Final step: arrived
    const endNode = NODES[path[path.length - 1]];
    directions.push({
      step: directions.length + 1,
      icon: '🏁',
      instruction: `Arrive at ${endNode.label}`,
      landmark: endNode.landmark + (endNode.accessNote ? ` ⚠️ Note: ${endNode.accessNote}` : ''),
      type: 'arrive',
      accessTag: null,
      distance: null,
    });

    return directions;
  }

  /**
   * Format total time nicely
   * @param {number} seconds
   * @returns {string}
   */
  function formatTime(seconds) {
    if (seconds < 60) return `${seconds} sec`;
    const mins = Math.round(seconds / 60);
    return mins === 1 ? '1 min' : `${mins} mins`;
  }

  /**
   * Check if a step-free route is possible given current lift status
   * @param {string} startId
   * @param {string} endId
   * @returns {boolean}
   */
  function canFindStepFree(startId, endId) {
    return findRoute(startId, endId, true) !== null;
  }

  return { findRoute, buildDirections, formatTime, canFindStepFree };

})();

window.RouteEngine = RouteEngine;
