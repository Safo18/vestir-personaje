// --- Definir personajes ---
const CHARACTERS = {
 const CHARACTERS = {
  P1: { name: "Luna", base: "images/P1_base.png", style:"normal", colors:["rojo","lila"] },
  P2: { name: "Max", base: "images/P2_base.png", style:"hippie", colors:["verde","amarillo"] }
};



let currentChar = CHARACTERS.p1;
let score = 0;
let worn = {};

// --- Definir prendas ---
const ITEMS = {
  "P1_camiseta_01": { slot:"torso", file:"images/P1_camiseta_01.png", style:"normal", color:"rojo", points_base:0 },
  "P1_camiseta_02": { slot:"torso", file:"images/P1_camiseta_02.png", style:"elegante", color:"azul", points_base:0 },
  "P1_falda_01": { slot:"legs", file:"images/P1_falda_01.png", style:"elegante", color:"rosa", points_base:0 },
  "P1_falda_02": { slot:"legs", file:"images/P1_falda_02.png", style:"normal", color:"lila", points_base:0 },
  "P1_vestido_01": { slot:"torso", file:"images/P1_vestido_01.png", style:"normal", color:"marrón", points_base:0 }
  "P2_pendientes_01": { slot:"head", file:"images/P2_pendientes_01.png", style:"hippie", color:"amarillo", points_base:0 },
  "P2_pendientes_02": { slot:"head", file:"images/P2_pendientes_02.png", style:"hippie", color:"verde", points_base:0 },
  "P2_vestido_01": { slot:"torso", file:"images/P2_vestido_01.png", style:"hippie", color:"verde", points_base:0 },
  "P2_vestido_02": { slot:"torso", file:"images/P2_vestido_02.png", style:"elegante", color:"rosa", points_base:0 }
};

// --- Actualizar UI ---
function updateScore(){
  document.getElementById('score').textContent = score;
}

function applyItem(item){
  // 1️⃣ Aplicar la prenda al personaje
  worn[item.slot] = item;
  const slotEl = document.getElementById(`slot-${item.slot}`);
  slotEl.src = item.file;

  // 2️⃣ Crear un elemento imagen para el mensaje
  const mensaje = document.createElement('img');
  mensaje.style.width = "200px";    // ajustar tamaño si quieres
  mensaje.style.height = "auto";
  mensaje.style.marginBottom = "10px";

  // 3️⃣ Comprobar si acierta estilo y color
  if(item.style === currentChar.style && currentChar.colors.includes(item.color)) {
    const p = 8;  // puntos si acierta ambos
    score += p;
    updateScore();

    // Imagen para correcto
    mensaje.src = "images/correcto.png";

  } else {
    // Imagen para fallo
    mensaje.src = "images/incorrecto.png";
  }

  // 4️⃣ Añadir la imagen al contenedor
  const contenedor = document.getElementById('scanned-list');
  contenedor.prepend(mensaje);
}



// --- Escaneo QR ---
function onScanSuccess(decodedText) {
  if (CHARACTERS[decodedText]) {
    // Es un personaje
    currentChar = CHARACTERS[decodedText];

    // Cambiar imagen base
    document.getElementById("base-img").src = currentChar.base;

    // Limpiar prendas anteriores
    worn = {};
    document.getElementById("slot-head").src = "";
    document.getElementById("slot-torso").src = "";
    document.getElementById("slot-legs").src = "";
    document.getElementById("slot-feet").src = "";

    // Reiniciar puntos
    score = 0;
    updateScore();

    return; // termina aquí porque es un personaje
  }

  // Si no es personaje, entonces es una prenda
  const item = ITEMS[decodedText];
  if (item) applyItem(item);
}


// --- Inicializar lector ---
const html5QrScanner = new Html5QrcodeScanner("qr-reader",{fps:8, qrbox:250});
html5QrScanner.render(onScanSuccess);
