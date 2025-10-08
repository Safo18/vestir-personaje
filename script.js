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

// Personaje activo por defecto
let currentCharId = "P1";
let currentChar = CHARACTERS[currentCharId];

// Variables globales
let score = 0;
let worn = {};

// --- Definir prendas ---
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
  "vestido_01": { 
    slot: "torso",
    style: "normal",
    color: "marrón",
    points_base: 0,
    files: {
      P1: "images/P1_vestido_01.png",
      P2: "images/P2_vestido_01.png"
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
  "pendientes_02": { 
    slot: "head",
    style: "hippie",
    color: "verde",
    points_base: 0,
    files: {
      P1: "images/P1_pendientes_02.png",
      P2: "images/P2_pendientes_02.png"
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

// --- Inicialización ---
window.onload = () => {
  document.getElementById("char-base").src = currentChar.base;
  updateScore();
};

// --- Función para cambiar personaje (cuando se escanea carta de personaje) ---
function selectCharacter(id){
  if(!CHARACTERS[id]) return;
  currentCharId = id;
  currentChar = CHARACTERS[id];
  document.getElementById("char-base").src = currentChar.base;
  worn = {};
  document.querySelectorAll(".clothes-slot").forEach(slot => slot.src = "");
  score = 0;
  updateScore();
}

// --- Aplicar prenda ---
function applyItem(item){
  const file = item.files[currentCharId];
  if(!file) return;

  // Aplica la imagen en el slot
  worn[item.slot] = item;
  document.getElementById(`slot-${item.slot}`).src = file;

  // Crear mensaje visual
  const mensaje = document.createElement("img");
  mensaje.style.width = "200px";
  mensaje.style.height = "auto";
  mensaje.style.marginBottom = "10px";

  // Verificar si coincide estilo y color
  if(item.style === currentChar.style && currentChar.colors.includes(item.color)){
    const p = 8;
    score += p;
    updateScore();
    mensaje.src = "images/correcto.png";
  } else {
    mensaje.src = "images/fallo.png";
  }

  document.getElementById("scanned-list").prepend(mensaje);
}

// --- Simulación de escaneo ---
function scanCard(cardId){
  // Si es un personaje
  if(CHARACTERS[cardId]){
    selectCharacter(cardId);
    return;
  }

  // Si es una prenda
  const item = ITEMS[cardId];
  if(item){
    applyItem(item);
  } else {
    alert("Carta no reconocida.");
  }
}

// --- Actualizar puntuación ---
function updateScore(){
  document.getElementById("score").innerText = "Puntos: " + score;
}

// --- Detectar parámetros en la URL y aplicar carta automáticamente ---
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const cardId = params.get("card");
  if (cardId) {
    setTimeout(() => {
      scanCard(cardId);
    }, 500);
  }
});


