/**
 * Logic Gate Challenge - Game Engine
 * Cybernetic educational gate simulator with reactive SVG wiring.
 */

// Educational Facts shown in level success modals
const GATE_KNOWLEDGE_BASE = {
  NOT: {
    title: "NOT Gate (Inverter)",
    desc: "A NOT gate reverses its input signal. If a 0 goes in, a 1 comes out. In modern computing, NOT gates are built using a pair of transistors to flip logic states to drive instructions."
  },
  AND: {
    title: "AND Gate",
    desc: "An AND gate outputs 1 only when BOTH inputs are 1. In computers, AND gates are used to check matching criteria, like masking memory addresses or validating state combinations."
  },
  OR: {
    title: "OR Gate",
    desc: "An OR gate outputs 1 if AT LEAST ONE input is 1. If both are 1, it still outputs 1. This gate is fundamental for selection pathways and logical choices."
  },
  XOR: {
    title: "XOR Gate (Exclusive OR)",
    desc: "An XOR gate outputs 1 if inputs are DIFFERENT, and 0 if they are IDENTICAL. It's the secret sauce behind binary arithmetic; full-adder circuits use XOR to calculate sums!"
  },
  UNIVERSAL: {
    title: "Universal Chaining",
    desc: "By combining gates (like OR and NOT), you create composite logic like NOR gates! Theoretically, any logical operation in existence can be built using only universal gates."
  }
};

// 8 Interactive Levels of progressing complexity
const levels = [
  {
    id: 1,
    title: "The Inverter",
    description: "Learn how to flip a binary signal. Convert a Low (0) input signal into a High (1) final output signal.",
    inputs: [
      { id: "A", value: 0 }
    ],
    slots: [
      { id: "S1", inputs: ["A"] }
    ],
    gatesAllowed: ["NOT", "AND", "OR", "XOR"],
    targetOutput: 1,
    hint: "Place a NOT gate in Slot 1. The NOT gate turns Off (0) to On (1)."
  },
  {
    id: 2,
    title: "The Union Gate",
    description: "Make the final output active (1) by bridging a dual-input node. One of your inputs is Active (1) and the other is Inactive (0).",
    inputs: [
      { id: "A", value: 1 },
      { id: "B", value: 0 }
    ],
    slots: [
      { id: "S1", inputs: ["A", "B"] }
    ],
    gatesAllowed: ["AND", "OR", "XOR"],
    targetOutput: 1,
    hint: "Use an OR gate in Slot 1! An OR gate returns 1 if at least one input is active."
  },
  {
    id: 3,
    title: "Perfect Harmony",
    description: "Ensure the output is High (1). Both inputs are already active. Select the gate that demands BOTH inputs are satisfied.",
    inputs: [
      { id: "A", value: 1 },
      { id: "B", value: 1 }
    ],
    slots: [
      { id: "S1", inputs: ["A", "B"] }
    ],
    gatesAllowed: ["AND", "OR", "XOR"],
    targetOutput: 1,
    hint: "Place an AND gate. It outputs 1 only when all connected signals are 1."
  },
  {
    id: 4,
    title: "Exclusive Difference",
    description: "Achieve an output of Low (0). Both inputs are High (1). Look for a gate that shuts off when inputs are perfectly matching.",
    inputs: [
      { id: "A", value: 1 },
      { id: "B", value: 1 }
    ],
    slots: [
      { id: "S1", inputs: ["A", "B"] }
    ],
    gatesAllowed: ["AND", "OR", "XOR"],
    targetOutput: 0,
    hint: "Try the XOR (Exclusive OR) gate! It outputs 0 if both of its inputs are matching (either both 1 or both 0)."
  },
  {
    id: 5,
    title: "Dual Stage series",
    description: "Connect two gates! Send inputs A & B into Slot 1, then pass its output to Slot 2 to negate it. Achieve a final Output of 0.",
    inputs: [
      { id: "A", value: 1 },
      { id: "B", value: 0 }
    ],
    slots: [
      { id: "S1", inputs: ["A", "B"] },
      { id: "S2", inputs: ["S1"] }
    ],
    gatesAllowed: ["NOT", "AND", "OR", "XOR"],
    targetOutput: 0,
    hint: "Place an OR gate in S1 to catch A's active signal, and a NOT gate in S2 to invert the 1 into a 0. This combined logic is called a NOR gate!"
  },
  {
    id: 6,
    title: "Guarded Gateways",
    description: "Your inputs are active (1). Achieve an output of 0. You cannot use AND directly at the final output! Chain them strategically.",
    inputs: [
      { id: "A", value: 1 },
      { id: "B", value: 1 }
    ],
    slots: [
      { id: "S1", inputs: ["A", "B"] },
      { id: "S2", inputs: ["S1"] }
    ],
    gatesAllowed: ["NOT", "AND", "OR", "XOR"],
    targetOutput: 0,
    hint: "Place an AND gate in S1 (which evaluates to 1) and a NOT gate in S2 (which inverts 1 to the final 0). This is a NAND gate!"
  },
  {
    id: 7,
    title: "Triple Choice Selector",
    description: "Three inputs! Merge A (1) and B (1) in Slot 1. Then combine Slot 1's output with C (0) in Slot 2. Get a final output of 1.",
    inputs: [
      { id: "A", value: 1 },
      { id: "B", value: 1 },
      { id: "C", value: 0 }
    ],
    slots: [
      { id: "S1", inputs: ["A", "B"] },
      { id: "S2", inputs: ["S1", "C"] }
    ],
    gatesAllowed: ["NOT", "AND", "OR", "XOR"],
    targetOutput: 1,
    hint: "Try placing an AND gate in S1 (giving 1), and an OR gate in S2. Since S1 is 1 and C is 0, the OR gate will yield 1!"
  },
  {
    id: 8,
    title: "Logic Architect Mastery",
    description: "The ultimate circuit design! inputs A=0, B=1, C=1. Slot 1 merges A & B. Slot 2 negates C. Slot 3 merges Slot 1 and Slot 2. Output must be 1.",
    inputs: [
      { id: "A", value: 0 },
      { id: "B", value: 1 },
      { id: "C", value: 1 }
    ],
    slots: [
      { id: "S1", inputs: ["A", "B"] }, // e.g. OR -> 1
      { id: "S2", inputs: ["C"] },      // e.g. NOT -> 0
      { id: "S3", inputs: ["S1", "S2"] } // e.g. XOR -> 1
    ],
    gatesAllowed: ["NOT", "AND", "OR", "XOR"],
    targetOutput: 1,
    hint: "Use OR/XOR in Slot 1 (yields 1), NOT in Slot 2 (yields 0), and an OR/XOR gate in Slot 3 to bridge those signals into the active 1 output!"
  }
];

// Core Game States
let currentLevelIndex = 0;
let score = 0;
let unlockedLevels = [0]; // unlocked indices
let completedLevels = []; // completed indices
let gateSlots = {}; // slotId -> gateType (AND, OR, NOT, XOR, null)
let inputValues = {}; // inputId -> 0/1 (dynamically toggled!)
let selectedGateType = null; // toolbox tapped gate
let attemptsOnCurrentLevel = 0;

// Setup on DOM loaded
window.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  setupEventListeners();
  loadAppState();
  showScreen('start-screen');
  renderLevelSelectors();
}

// Local Storage helpers for state persistence
function loadAppState() {
  const savedScore = localStorage.getItem('lgc_score');
  const savedCompleted = localStorage.getItem('lgc_completed');
  const savedUnlocked = localStorage.getItem('lgc_unlocked');
  
  if (savedScore !== null) score = parseInt(savedScore, 10);
  if (savedCompleted !== null) completedLevels = JSON.parse(savedCompleted);
  if (savedUnlocked !== null) unlockedLevels = JSON.parse(savedUnlocked);
  
  updateGlobalStatsHeader();
}

function saveAppState() {
  localStorage.setItem('lgc_score', score);
  localStorage.setItem('lgc_completed', JSON.stringify(completedLevels));
  localStorage.setItem('lgc_unlocked', JSON.stringify(unlockedLevels));
}

// Interactive screen switching
function showScreen(screenId) {
  document.querySelectorAll('.screen-root').forEach(el => el.classList.add('hidden'));
  document.getElementById(screenId).classList.remove('hidden');
  
  if (screenId === 'game-screen') {
    // Redraw SVG wires after layout finishes rendering
    setTimeout(() => {
      drawWires();
    }, 100);
  }
}

// Side-bar Level Navigation render
function renderLevelSelectors() {
  const scroller = document.getElementById('level-scroller-list');
  scroller.innerHTML = '';
  
  levels.forEach((lvl, idx) => {
    const isLocked = !unlockedLevels.includes(idx);
    const isCompleted = completedLevels.includes(idx);
    const isActive = currentLevelIndex === idx;
    
    const btn = document.createElement('button');
    btn.className = `level-button ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`;
    btn.disabled = isLocked;
    
    // Create inner markup
    btn.innerHTML = `
      <div class="level-button-info">
        <span class="level-indicator-dot"></span>
        <span>Lvl ${lvl.id}: ${lvl.title.replace(/Level\s\d+:\s/i, '')}</span>
      </div>
      <span>${isCompleted ? '✓' : (isLocked ? '🔒' : '')}</span>
    `;
    
    btn.addEventListener('click', () => {
      if (!isLocked) {
        selectLevel(idx);
      }
    });
    
    scroller.appendChild(btn);
  });
}

function selectLevel(idx) {
  currentLevelIndex = idx;
  attemptsOnCurrentLevel = 0;
  
  // Initialize level gate values
  const levelData = levels[idx];
  gateSlots = {};
  levelData.slots.forEach(slot => {
    gateSlots[slot.id] = null;
  });
  
  // Set default raw input signals
  inputValues = {};
  levelData.inputs.forEach(inp => {
    inputValues[inp.id] = inp.value;
  });
  
  selectedGateType = null;
  clearGateSelectionsInToolbox();
  
  renderLevelHTML();
  renderLevelSelectors();
  updateGlobalStatsHeader();
  
  // Refresh lines
  setTimeout(() => {
    drawWires();
  }, 50);
}

// Renders interactive columns (inputs, slots, outputs) dynamically based on topology!
function renderLevelHTML() {
  const levelData = levels[currentLevelIndex];
  
  // Configure Headers
  document.getElementById('current-level-title').innerText = levelData.title;
  document.getElementById('level-description').innerText = levelData.description;
  document.getElementById('objective-description').innerText = `Assemble a logic circuit producing ${levelData.targetOutput} at the final output coordinate.`;
  
  // Calculate spatial layers/columns mathematically
  // Inputs = layer 0. Slots are layers = 1 + max(layer of their inputs)
  const elementLayers = {};
  
  // Seed inputs at layer 0
  levelData.inputs.forEach(inp => {
    elementLayers[inp.id] = 0;
  });
  
  // Iteratively compute slot layers
  let changed = true;
  let iterations = 0;
  while (changed && iterations < 20) {
    changed = false;
    iterations++;
    levelData.slots.forEach(slot => {
      let maxInputLayer = -1;
      let allReady = true;
      
      slot.inputs.forEach(inpId => {
        if (elementLayers[inpId] !== undefined) {
          if (elementLayers[inpId] > maxInputLayer) {
            maxInputLayer = elementLayers[inpId];
          }
        } else {
          allReady = false;
        }
      });
      
      if (allReady) {
        const computedLayer = maxInputLayer + 1;
        if (elementLayers[slot.id] !== computedLayer) {
          elementLayers[slot.id] = computedLayer;
          changed = true;
        }
      }
    });
  }
  
  // Create column grid layers
  const maxLayer = Math.max(...Object.values(elementLayers), 1);
  const boardNodes = document.getElementById('board-nodes-layer');
  boardNodes.innerHTML = '';
  
  // Generate HTML Column blocks
  for (let layer = 0; layer <= maxLayer + 1; layer++) {
    const colEl = document.createElement('div');
    colEl.className = 'board-column';
    colEl.setAttribute('data-col-layer', layer);
    boardNodes.appendChild(colEl);
  }
  
  // Place Inputs (Layer 0)
  const inputCol = boardNodes.querySelector('[data-col-layer="0"]');
  levelData.inputs.forEach(inp => {
    const activeClass = inputValues[inp.id] === 1 ? 'active-1' : 'active-0';
    const card = document.createElement('div');
    card.className = `node-input-card ${activeClass}`;
    card.setAttribute('data-input-id', inp.id);
    card.innerHTML = `
      <div class="node-label-pill">IN:${inp.id}</div>
      <div class="node-value-toggle">${inputValues[inp.id]}</div>
      <div class="socket-out"></div>
    `;
    
    // Toggling support
    card.addEventListener('click', () => {
      inputValues[inp.id] = inputValues[inp.id] === 1 ? 0 : 1;
      evaluateAndRefreshCircuit();
    });
    
    inputCol.appendChild(card);
  });
  
  // Place Slots (Layer >= 1)
  levelData.slots.forEach(slot => {
    const layer = elementLayers[slot.id] || 1;
    const colEl = boardNodes.querySelector(`[data-col-layer="${layer}"]`);
    
    const slotCard = document.createElement('div');
    slotCard.className = 'gate-slot-card';
    if (gateSlots[slot.id]) {
      slotCard.classList.add('occupied');
    }
    slotCard.setAttribute('data-slot-id', slot.id);
    slotCard.id = `slot-${slot.id}`;
    
    renderSlotInnerContent(slot, slotCard);
    colEl.appendChild(slotCard);
    
    // Hook Drag & Drop handlers
    setupSlotDragEvents(slotCard, slot);
  });
  
  // Place Final Output Node in the final column
  const finalCol = boardNodes.querySelector(`[data-col-layer="${maxLayer + 1}"]`);
  const finalCard = document.createElement('div');
  finalCard.className = 'node-output-card empty';
  finalCard.id = 'final-output-card';
  finalCard.innerHTML = `
    <div class="output-socket-in"></div>
    <div class="output-circle">?</div>
    <div class="output-label">OUTPUT</div>
    <div class="target-badge">GOAL: ${levelData.targetOutput}</div>
  `;
  finalCol.appendChild(finalCard);
  
  // Evaluate immediately to link sockets & signals
  evaluateAndRefreshCircuit();
}

// Generates the correct inner parts of slots
function renderSlotInnerContent(slot, slotCard) {
  const activeGate = gateSlots[slot.id];
  slotCard.innerHTML = '';
  
  // Draw Top mini label
  const label = document.createElement('span');
  label.className = 'slot-label-top';
  label.innerText = `SLOT ${slot.id.replace('S','')}`;
  slotCard.appendChild(label);
  
  // Custom container for input sockets on the left side
  const inContainer = document.createElement('div');
  inContainer.className = 'socket-in-container';
  
  // Single input slots (e.g. NOT gate levels) render 1 socket, dual render 2
  const inputCount = slot.inputs.length;
  for (let i = 0; i < inputCount; i++) {
    const socket = document.createElement('div');
    socket.className = 'socket-in';
    inContainer.appendChild(socket);
  }
  slotCard.appendChild(inContainer);
  
  if (activeGate) {
    // Renders active gate visualization inside
    const gateBlock = document.createElement('div');
    gateBlock.className = 'placed-gate';
    
    let logicalSymbol = activeGate;
    if (activeGate === 'AND') logicalSymbol = 'AND';
    if (activeGate === 'OR') logicalSymbol = 'OR';
    if (activeGate === 'NOT') logicalSymbol = 'NOT';
    if (activeGate === 'XOR') logicalSymbol = 'XOR';
    
    gateBlock.innerHTML = `
      <div class="placed-gate-symbol">${logicalSymbol}</div>
      <div class="placed-gate-type">${activeGate} GATE</div>
    `;
    
    // Trash / Clear Button
    const clearBtn = document.createElement('div');
    clearBtn.className = 'slot-clear-btn';
    clearBtn.innerText = '×';
    clearBtn.title = "Remove gate";
    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Stop trigger select
      clearSlot(slot.id);
    });
    gateBlock.appendChild(clearBtn);
    
    slotCard.appendChild(gateBlock);
    
    // Right output socket for propagating signal out
    const outSocket = document.createElement('div');
    outSocket.className = 'socket-out';
    slotCard.appendChild(outSocket);
  } else {
    // Placeholder default state
    const placeholder = document.createElement('div');
    placeholder.className = 'slot-placeholder';
    
    // Draw placeholder layout
    placeholder.innerHTML = `
      <svg class="slot-placeholder-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <div class="slot-placeholder-text">DROP HERE</div>
    `;
    slotCard.appendChild(placeholder);
  }
}

// Circuit calculation & signal tracking engine
function evaluateAndRefreshCircuit() {
  const levelData = levels[currentLevelIndex];
  const signals = {}; // elementId -> 0 or 1 or null
  
  // Sync inputs
  levelData.inputs.forEach(inp => {
    signals[inp.id] = inputValues[inp.id];
    
    // Dynamic styling of input card
    const card = document.querySelector(`[data-input-id="${inp.id}"]`);
    if (card) {
      card.className = `node-input-card ${inputValues[inp.id] === 1 ? 'active-1' : 'active-0'}`;
      card.querySelector('.node-value-toggle').innerText = inputValues[inp.id];
    }
  });
  
  // Calculate slots recursively or iteratively based on topological layers
  let iterations = 0;
  let processing = true;
  while (processing && iterations < 15) {
    processing = false;
    iterations++;
    
    levelData.slots.forEach(slot => {
      if (signals[slot.id] !== undefined) return; // already solved
      
      const activeGate = gateSlots[slot.id];
      if (!activeGate) {
        signals[slot.id] = null; // unset
        return;
      }
      
      // Collect input values
      const availableInputs = slot.inputs.map(inpId => signals[inpId]);
      
      // If any required signal is null/empty, we can't solve it yet
      if (availableInputs.includes(null) || availableInputs.includes(undefined)) {
        signals[slot.id] = null;
        return;
      }
      
      // Compute specific Boolean outputs
      let outputVal = null;
      if (activeGate === 'NOT') {
        const val = availableInputs[0];
        outputVal = val === 1 ? 0 : 1;
      } else if (activeGate === 'AND') {
        const val1 = availableInputs[0];
        const val2 = availableInputs[1] !== undefined ? availableInputs[1] : val1; // single input tie fallback
        outputVal = (val1 === 1 && val2 === 1) ? 1 : 0;
      } else if (activeGate === 'OR') {
        const val1 = availableInputs[0];
        const val2 = availableInputs[1] !== undefined ? availableInputs[1] : val1;
        outputVal = (val1 === 1 || val2 === 1) ? 1 : 0;
      } else if (activeGate === 'XOR') {
        const val1 = availableInputs[0];
        const val2 = availableInputs[1] !== undefined ? availableInputs[1] : val1;
        outputVal = val1 !== val2 ? 1 : 0;
      }
      
      signals[slot.id] = outputVal;
      processing = true; // triggered updates
    });
  }
  
  // Propagate values to physical slots DOM sockets styles
  levelData.slots.forEach(slot => {
    const slotCard = document.getElementById(`slot-${slot.id}`);
    if (!slotCard) return;
    
    const activeGate = gateSlots[slot.id];
    const signalState = signals[slot.id];
    
    // Style upstream in-sockets
    const inSockets = slotCard.querySelectorAll('.socket-in');
    slot.inputs.forEach((inpId, i) => {
      const socket = inSockets[i];
      if (socket) {
        socket.className = 'socket-in';
        const inpSignal = signals[inpId];
        if (inpSignal === 1) socket.classList.add('signal-1');
        if (inpSignal === 0) socket.classList.add('signal-0');
      }
    });
    
    // Style the slot card status or output sockets
    if (activeGate) {
      const outSocket = slotCard.querySelector('.socket-out');
      if (outSocket) {
        outSocket.className = 'socket-out';
        if (signalState === 1) slotCard.className = 'gate-slot-card occupied active-1';
        else if (signalState === 0) slotCard.className = 'gate-slot-card occupied active-0';
        else slotCard.className = 'gate-slot-card occupied';
      }
    }
  });
  
  // Configure Final Output Box
  const finalCard = document.getElementById('final-output-card');
  const finalInSocket = finalCard.querySelector('.output-socket-in');
  const finalValText = finalCard.querySelector('.output-circle');
  
  // Find final gate ID (the last slot in our topology)
  const finalSlot = levelData.slots[levelData.slots.length - 1];
  const finalSignal = signals[finalSlot.id];
  
  finalCard.className = 'node-output-card';
  finalInSocket.className = 'output-socket-in';
  
  if (finalSignal === 1) {
    finalCard.classList.add('active-1');
    finalInSocket.classList.add('active-1');
    finalValText.innerText = '1';
  } else if (finalSignal === 0) {
    finalCard.classList.add('active-0');
    finalInSocket.classList.add('active-0');
    finalValText.innerText = '0';
  } else {
    finalCard.classList.add('empty');
    finalValText.innerText = '?';
  }
  
  // Re-draw connection curves according to computed signals
  drawWiresWithSignals(signals);
}

// Bezier Curves renderer connecting layout sockets
function drawWiresWithSignals(signals) {
  const svg = document.getElementById('circuit-svg-canvas');
  if (!svg) return;
  
  // Clear any dynamic wires
  const dynamicWires = svg.querySelectorAll('.dynamic-wire-path');
  dynamicWires.forEach(el => el.remove());
  
  const boardRect = document.getElementById('circuit-board').getBoundingClientRect();
  const levelData = levels[currentLevelIndex];
  
  // Helper to draw a single curve
  function drawConnection(srcEl, tgtEl, signalValue) {
    if (!srcEl || !tgtEl) return;
    
    const srcRect = srcEl.getBoundingClientRect();
    const tgtRect = tgtEl.getBoundingClientRect();
    
    const x1 = srcRect.left + srcRect.width / 2 - boardRect.left;
    const y1 = srcRect.top + srcRect.height / 2 - boardRect.top;
    
    const x2 = tgtRect.left + tgtRect.width / 2 - boardRect.left;
    const y2 = tgtRect.top + tgtRect.height / 2 - boardRect.top;
    
    // Nice S-shaped Bezier path calculation
    const controlOffset = Math.abs(x2 - x1) * 0.4;
    const d = `M ${x1} ${y1} C ${x1 + controlOffset} ${y1}, ${x2 - controlOffset} ${y2}, ${x2} ${y2}`;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.className = 'circuit-wire dynamic-wire-path';
    
    if (signalValue === 1) {
      path.classList.add('active-1');
    } else if (signalValue === 0) {
      path.classList.add('active-0');
    } else {
      path.classList.add('empty-wire');
    }
    
    svg.appendChild(path);
  }
  
  // Wire 1: Connect Inputs to Slot sockets or direct lines
  levelData.slots.forEach(slot => {
    const slotCard = document.getElementById(`slot-${slot.id}`);
    if (!slotCard) return;
    
    const tgtSockets = slotCard.querySelectorAll('.socket-in');
    
    slot.inputs.forEach((inpId, idx) => {
      let srcSocket = null;
      
      if (inpId.startsWith('S')) {
        // Source is another Slot output
        const srcSlotCard = document.getElementById(`slot-${inpId}`);
        if (srcSlotCard) srcSocket = srcSlotCard.querySelector('.socket-out');
      } else {
        // Source is raw Input card
        const srcInputCard = document.querySelector(`[data-input-id="${inpId}"]`);
        if (srcInputCard) srcSocket = srcInputCard.querySelector('.socket-out');
      }
      
      const tgtSocket = tgtSockets[idx];
      const connectingSignal = signals[inpId];
      
      drawConnection(srcSocket, tgtSocket, connectingSignal);
    });
  });
  
  // Wire 2: Link last active logical slot to final Output Node
  const finalSlot = levelData.slots[levelData.slots.length - 1];
  const finalSlotCard = document.getElementById(`slot-${finalSlot.id}`);
  const outputNode = document.getElementById('final-output-card');
  
  if (finalSlotCard && outputNode) {
    const srcSocket = finalSlotCard.querySelector('.socket-out');
    const tgtSocket = outputNode.querySelector('.output-socket-in');
    const finalSignalValue = signals[finalSlot.id];
    
    drawConnection(srcSocket, tgtSocket, finalSignalValue);
  }
}

// Recalculates canvas wires without computing signal values (helper)
function drawWires() {
  evaluateAndRefreshCircuit();
}

// Drag & Drop bindings
function setupSlotDragEvents(slotCard, slot) {
  
  // Allow drop-overs
  slotCard.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  
  slotCard.addEventListener('dragenter', (e) => {
    e.preventDefault();
    slotCard.classList.add('drag-over');
  });
  
  slotCard.addEventListener('dragleave', () => {
    slotCard.classList.remove('drag-over');
  });
  
  slotCard.addEventListener('drop', (e) => {
    e.preventDefault();
    slotCard.classList.remove('drag-over');
    
    const gateType = e.dataTransfer.getData('text/plain');
    if (gateType) {
      placeGate(slot.id, gateType);
    }
  });
  
  // Support touch-tap click-to-place fallback
  slotCard.addEventListener('click', () => {
    if (selectedGateType) {
      placeGate(slot.id, selectedGateType);
      selectedGateType = null;
      clearGateSelectionsInToolbox();
    }
  });
}

function placeGate(slotId, gateType) {
  const levelData = levels[currentLevelIndex];
  
  // Optional gating control (by levels config limits)
  if (levelData.gatesAllowed && !levelData.gatesAllowed.includes(gateType)) {
    // Notify user of restrictions (gracefully)
    alert(`That gate is restricted! You can only use: ${levelData.gatesAllowed.join(', ')}.`);
    return;
  }
  
  gateSlots[slotId] = gateType;
  
  // Redraw node cards and evaluate connections
  const slotCard = document.getElementById(`slot-${slotId}`);
  if (slotCard) {
    slotCard.classList.add('occupied');
    const slot = levelData.slots.find(s => s.id === slotId);
    renderSlotInnerContent(slot, slotCard);
    setupSlotDragEvents(slotCard, slot); // rebind
  }
  
  evaluateAndRefreshCircuit();
}

function clearSlot(slotId) {
  gateSlots[slotId] = null;
  
  const slotCard = document.getElementById(`slot-${slotId}`);
  if (slotCard) {
    slotCard.classList.remove('occupied');
    slotCard.classList.remove('active-1');
    slotCard.classList.remove('active-0');
    const slot = levels[currentLevelIndex].slots.find(s => s.id === slotId);
    renderSlotInnerContent(slot, slotCard);
    setupSlotDragEvents(slotCard, slot); // rebind
  }
  
  evaluateAndRefreshCircuit();
}

function clearGateSelectionsInToolbox() {
  document.querySelectorAll('.toolbox-gate-pill').forEach(pill => {
    pill.classList.remove('selected-ready');
  });
  const guide = document.getElementById('tap-to-place-guide');
  guide.classList.remove('highlight');
  guide.innerText = "Drag a gate into the circuit board or tap a gate to select it.";
}

// User submission checking
function checkLevelSolution() {
  const levelData = levels[currentLevelIndex];
  attemptsOnCurrentLevel++;
  
  // Verify all slots are populated
  const emptySlotsCount = levelData.slots.filter(s => !gateSlots[s.id]).length;
  if (emptySlotsCount > 0) {
    alert("Incomplete Circuit! Please place a logic gate in every slot to close the connection.");
    return;
  }
  
  // Solve Circuit Output
  const signals = {};
  levelData.inputs.forEach(inp => {
    signals[inp.id] = inp.value; // Evaluate using standard level default inputs!
  });
  
  let iterations = 0;
  let processing = true;
  while (processing && iterations < 15) {
    processing = false;
    iterations++;
    
    levelData.slots.forEach(slot => {
      if (signals[slot.id] !== undefined) return;
      
      const activeGate = gateSlots[slot.id];
      const availableInputs = slot.inputs.map(inpId => signals[inpId]);
      
      let outputVal = null;
      if (activeGate === 'NOT') {
        outputVal = availableInputs[0] === 1 ? 0 : 1;
      } else if (activeGate === 'AND') {
        const val1 = availableInputs[0];
        const val2 = availableInputs[1] !== undefined ? availableInputs[1] : val1;
        outputVal = (val1 === 1 && val2 === 1) ? 1 : 0;
      } else if (activeGate === 'OR') {
        const val1 = availableInputs[0];
        const val2 = availableInputs[1] !== undefined ? availableInputs[1] : val1;
        outputVal = (val1 === 1 || val2 === 1) ? 1 : 0;
      } else if (activeGate === 'XOR') {
        const val1 = availableInputs[0];
        const val2 = availableInputs[1] !== undefined ? availableInputs[1] : val1;
        outputVal = val1 !== val2 ? 1 : 0;
      }
      
      signals[slot.id] = outputVal;
      processing = true;
    });
  }
  
  // Find final level output value
  const finalSlot = levelData.slots[levelData.slots.length - 1];
  const finalOutputResult = signals[finalSlot.id];
  
  // Compare outcomes!
  if (finalOutputResult === levelData.targetOutput) {
    triggerCorrectAnimation();
  } else {
    triggerWrongAnimation();
  }
}

// Answer checked correctly animation
function triggerCorrectAnimation() {
  const overlay = document.getElementById('board-feedback-overlay');
  overlay.className = 'board-feedback-overlay correct-flash';
  
  // Play nice pulse sound or animation delay
  let pointsAwarded = 100;
  if (attemptsOnCurrentLevel === 1) {
    pointsAwarded += 50; // First try bonus!
  }
  
  // Persist Score
  if (!completedLevels.includes(currentLevelIndex)) {
    score += pointsAwarded;
    completedLevels.push(currentLevelIndex);
  }
  
  // Unlock next level automatically
  const nextLvlIdx = currentLevelIndex + 1;
  if (nextLvlIdx < levels.length && !unlockedLevels.includes(nextLvlIdx)) {
    unlockedLevels.push(nextLvlIdx);
  }
  
  saveAppState();
  
  // Show modal with detailed analytical logs after half a second
  setTimeout(() => {
    overlay.className = 'board-feedback-overlay'; // clear
    showCompletionModal(pointsAwarded);
  }, 800);
}

// Selected gate knowledge map resolver
function showCompletionModal(pointsGained) {
  const levelData = levels[currentLevelIndex];
  const modal = document.getElementById('success-modal');
  
  // Resolve which gates were used specifically to show accurate facts
  const usedGates = Array.from(new Set(Object.values(gateSlots)));
  let knowledgeKey = usedGates[0] || 'NOT';
  if (usedGates.length > 1) {
    knowledgeKey = 'UNIVERSAL'; // Chaining fact
  }
  
  const factData = GATE_KNOWLEDGE_BASE[knowledgeKey] || GATE_KNOWLEDGE_BASE.NOT;
  
  document.getElementById('modal-points-text').innerText = `+${pointsGained} Bits`;
  document.getElementById('fact-card-title').innerText = factData.title;
  document.getElementById('fact-card-desc').innerText = factData.desc;
  
  // Configure next button
  const nextLvlBtn = document.getElementById('next-level-modal-btn');
  if (currentLevelIndex + 1 >= levels.length) {
    nextLvlBtn.innerText = "Finish Challenge";
  } else {
    nextLvlBtn.innerText = "Next Circuit";
  }
  
  modal.classList.remove('hidden');
}

function handleModalNextLevel() {
  const modal = document.getElementById('success-modal');
  modal.classList.add('hidden');
  
  if (currentLevelIndex + 1 >= levels.length) {
    // Finished all levels! Show victory podium screen
    showFinalVictoryScreen();
  } else {
    selectLevel(currentLevelIndex + 1);
  }
}

function showFinalVictoryScreen() {
  showScreen('completed-screen');
  document.getElementById('final-total-score').innerText = score;
}

// Wrong solution feedback animation with shake
function triggerWrongAnimation() {
  const overlay = document.getElementById('board-feedback-overlay');
  overlay.className = 'board-feedback-overlay wrong-flash';
  
  // Shake board container
  const board = document.getElementById('circuit-board');
  board.style.animation = 'none';
  board.offsetHeight; // trigger reflow
  
  // Apply visual shaking class
  board.style.animation = 'scaleUp 0.15s ease-out';
  // Also alert user
  setTimeout(() => {
    overlay.className = 'board-feedback-overlay';
    alert("Circuit Evaluation Failed! The output does not match the target goal. Check your signals flow and try again.");
  }, 500);
}

function resetCurrentLevel() {
  if (confirm("Reset current circuit components back to empty?")) {
    selectLevel(currentLevelIndex);
  }
}

function showLevelHint() {
  const hint = levels[currentLevelIndex].hint;
  alert(`💡 Circuit Hint:\n${hint}`);
}

function updateGlobalStatsHeader() {
  document.getElementById('stat-display-level').innerText = `${currentLevelIndex + 1} / ${levels.length}`;
  document.getElementById('stat-display-score').innerText = score;
}

// Drag & Drop toolbox setup
function setupEventListeners() {
  
  // Start Game Button
  document.getElementById('start-game-btn').addEventListener('click', () => {
    selectLevel(0);
    showScreen('game-screen');
  });
  
  // Restart Entire Game Button
  document.getElementById('restart-all-btn').addEventListener('click', () => {
    if (confirm("Are you sure you want to completely erase progress and start over?")) {
      score = 0;
      unlockedLevels = [0];
      completedLevels = [];
      saveAppState();
      selectLevel(0);
      showScreen('game-screen');
    }
  });
  
  // Modal OK button
  document.getElementById('next-level-modal-btn').addEventListener('click', () => {
    handleModalNextLevel();
  });
  
  // Game footer actions
  document.getElementById('btn-reset-level').addEventListener('click', resetCurrentLevel);
  document.getElementById('btn-get-hint').addEventListener('click', showLevelHint);
  document.getElementById('btn-check-solution').addEventListener('click', checkLevelSolution);
  
  // Connect draggable components inside toolbox menu
  document.querySelectorAll('.toolbox-gate-pill').forEach(pill => {
    const gateType = pill.getAttribute('data-gate');
    
    // HTML5 native drag support
    pill.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', gateType);
      e.dataTransfer.effectAllowed = 'copy';
      
      // Highlight matching slots on board
      document.querySelectorAll('.gate-slot-card:not(.occupied)').forEach(slot => {
        slot.style.borderColor = 'rgba(6, 182, 212, 0.7)';
      });
    });
    
    pill.addEventListener('dragend', () => {
      document.querySelectorAll('.gate-slot-card').forEach(slot => {
        slot.style.borderColor = '';
      });
    });
    
    // Tap-to-Place support
    pill.addEventListener('click', () => {
      if (selectedGateType === gateType) {
        // Toggle/Deselect
        selectedGateType = null;
        clearGateSelectionsInToolbox();
      } else {
        selectedGateType = gateType;
        clearGateSelectionsInToolbox();
        
        pill.classList.add('selected-ready');
        const guide = document.getElementById('tap-to-place-guide');
        guide.classList.add('highlight');
        guide.innerText = `[${gateType} SELECTED] Tap any empty slot on the circuit board to place it!`;
      }
    });
  });
  
  // Back to start screen from victory screen
  document.getElementById('btn-play-again').addEventListener('click', () => {
    score = 0;
    unlockedLevels = [0];
    completedLevels = [];
    saveAppState();
    showScreen('start-screen');
    renderLevelSelectors();
  });
  
  // Dynamic resize listener to automatically adjust SVG lines relative to viewport density
  window.addEventListener('resize', () => {
    drawWires();
  });
}
