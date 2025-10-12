// --- Definir personajes ---
const CHARACTERS = {
  P1: { 
    name: "Luna", 
    base: "images/P1_base.png", 
    style: "normal", 
    colors: ["rojo", "lila"] 
  },
  P2: { 
    name: "Max", 
    base: "images/P2_base.png", 
    style: "hippie", 
    colors: ["verde", "amarillo"] 
  }
};

// Personaje activo
let currentCharId = "P1";
let currentChar = CHARACTERS[currentCharId];
let score = 0;
let worn = {}; // prendas actuales
let layerIndex = 1; // controlará el orden de apilado de las prendas

// --- Prendas disponibles ---
const ITEMS = {
  "camiseta_01": { 
    slot: "torso",
    style: "normal",
    color: "rojo",
    points_base: 0,
    files: {
      P1: "images/P1_camiseta_01.png",
      P2: "images/P2_camiseta_01.png"
    }
  },
  "camiseta_02": { 
    slot: "torso",
    style: "normal",
    color: "azul",
    points_base: 0,
    files: {
      P1: "images/P1_camiseta_02.png",
      P2: "images/P1_camiseta_02.png"
    }
  },
  "falda_01": { 
    slot: "legs",
    style: "elegante",
    color: "rosa",
    points_base: 0,
    files: {
      P1: "images/P1_falda_01.png",
      P2: "images/P1_falda_01.png"
    }
  },
   "falda_02": { 
    slot: "legs",
    style: "normal",
    color: "lila",
    points_base: 0,
    files: {
      P1: "images/P1_falda_02.png",
      P2: "images/P1_falda_02.png"
    }
  },
  "vestido_01": { 
    slot: "torso",
    style: "normal",
    color: "marron",
    points_base: 0,
    files: {
      P1: "images/P1_vestido_01.png",
      P2: "images/P1_vestido_01.png"
    }
  },
  "P2_vestido_01": { 
    slot: "torso",
    style: "hippie",
    color: "verde",
    points_base: 0,
    files: {
      P1: "images/P2_vestido_01.png",
      P2: "images/P2_vestido_01.png"
    }
  },
  "vestido_02": { 
    slot: "torso",
    style: "elegante",
    color: "rosa",
    points_base: 0,
    files: {
      P1: "images/P2_vestido_02.png",
      P2: "images/P2_vestido_02.png"
    }
  },
  "pendientes_01": { 
    slot: "head",
    style: "hippie",
    color: "amarillo",
    points_base: 0,
    files: {
      P1: "images/P2_pendientes_01.png",
      P2: "images/P2_pendientes_01.png"
    }
  },
  "pendientes_02": { 
    slot: "head",
    style: "hippie",
    color: "verde",
    points_base: 0,
    files: {
      P1: "images/P2_pendientes_02.png",
      P2: "images/P2_pendientes_02.png"
    }
  }
};

// --- Guardar estado del juego ---
function saveGameState() {
  const gameState = {
    currentCharId: currentCharId,
    worn: worn
  };
  localStorage.setItem("dressupGameState", JSON.stringify(gameState));
}

// --- Cargar estado del juego ---
function loadGameState() {
  const saved = localStorage.getItem("dressupGameState");
  if (!saved) return;
  const state = JSON.parse(saved);

  currentCharId = state.currentCharId || "P1";
  currentChar = CHARACTERS[currentCharId];
  worn = state.worn || {};

  // Carga el personaje base
  document.getElementById("char-base").src = currentChar.base;

  // Restaurar prendas y sus capas
  for (let slot in worn) {
    const item = worn[slot];
    if (item && item.files && item.files[currentCharId]) {
      const slotImg = document.getElementById(`slot-${slot}`);
      slotImg.src = item.files[currentCharId];
      
      // Mantener la capa (z-index)
      slotImg.style.zIndex = item.z || 1;

      // Actualizar el contador de capas
      if (item.z && item.z > layerIndex) {
        layerIndex = item.z;
      }
    }
  }
}

// --- Reiniciar juego ---
function resetGame() {
  localStorage.removeItem("dressupGameState");
  location.reload();
}

// --- Aplicar prenda ---
function applyItem(item){
  const file = item.files[currentCharId];
  if(!file) return;

  worn[item.slot] = item;
  document.getElementById(`slot-${item.slot}`).src = file;
  saveGameState();
}

// --- Escanear carta (personaje o prenda) ---
function scanCard(cardId){
  if(CHARACTERS[cardId]){
    selectCharacter(cardId);
    return;
  }

  const item = ITEMS[cardId];
  if(item){
    applyItem(item);
  } else {
    alert("Carta no reconocida.");
  }
}

// --- Comprobar look completo ---
function checkOutfit(){
  const mensaje = document.createElement('img');
  mensaje.style.width = "250px";
  mensaje.style.height = "auto";
  mensaje.style.margin = "20px auto";
  mensaje.style.display = "block";

  let correct = true;
  for(let slot in worn){
    const item = worn[slot];
    if(!item) continue;
    if(item.style !== currentChar.style || !currentChar.colors.includes(item.color)){
      correct = false;
      break;
    }
  }

  const container = document.getElementById('scanned-list');
  container.innerHTML = "";
  mensaje.src = correct && Object.keys(worn).length > 0
    ? "images/correcto.png"
    : "images/incorrecto.png";
  container.appendChild(mensaje);
}

// --- Cargar estado al inicio ---
window.onload = () => {
  loadGameState();
};

// --- Detectar parámetro ?card= para escaneo automático ---
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const cardId = params.get("card");
  if (cardId) {
    setTimeout(() => {
      scanCard(cardId);
    }, 800);
  }
});
