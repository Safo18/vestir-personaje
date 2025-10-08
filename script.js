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
  "falda_01": { 
    slot: "legs",
    style: "elegante",
    color: "rosa",
    points_base: 0,
    files: {
      P1: "images/P1_falda_01.png",
      P2: "images/P2_falda_01.png"
    }
  },
  "pendientes_01": { 
    slot: "head",
    style: "hippie",
    color: "amarillo",
    points_base: 0,
    files: {
      P1: "images/P1_pendientes_01.png",
      P2: "images/P2_pendientes_01.png"
    }
  },
  "zapatos_01": { 
    slot: "feet",
    style: "normal",
    color: "lila",
    points_base: 0,
    files: {
      P1: "images/P1_zapatos_01.png",
      P2: "images/P2_zapatos_01.png"
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

  document.getElementById("char-base").src = currentChar.base;

  for (let slot in worn) {
    const item = worn[slot];
    if (item && item.files && item.files[currentCharId]) {
      document.getElementById(`slot-${slot}`).src = item.files[currentCharId];
    }
  }
}

// --- Reiniciar juego ---
function resetGame() {
  localStorage.removeItem("dressupGameState");
  location.reload();
}

// --- Cambiar personaje ---
function selectCharacter(id){
  if(!CHARACTERS[id]) return;
  currentCharId = id;
  currentChar = CHARACTERS[id];
  document.getElementById("char-base").src = currentChar.base;
  worn = {};
  saveGameState();
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
    : "images/fallo.png";
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
