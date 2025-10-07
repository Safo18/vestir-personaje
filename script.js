// --- Definir personajes ---
const CHARACTERS = {
  luna: { name: "Luna", style:"elegante", colors:["azul","blanco"] }
};

let currentChar = CHARACTERS.luna;
let score = 0;
let worn = {};

// --- Definir prendas ---
const ITEMS = {
  "hat01": { slot:"head", file:"images/hat01.png", style:"elegante", color:"azul", points_base:5 },
  "shirt01": { slot:"torso", file:"images/shirt01.png", style:"elegante", color:"azul", points_base:10 },
  "pants01": { slot:"legs", file:"images/pants01.png", style:"elegante", color:"azul", points_base:6 },
  "shoes01": { slot:"feet", file:"images/shoes01.png", style:"elegante", color:"negro", points_base:4 }
};

// --- Actualizar UI ---
function updateScore(){
  document.getElementById('score').textContent = score;
}

// --- Aplicar prenda ---
function applyItem(item){
  worn[item.slot] = item;
  const slotEl = document.getElementById(`slot-${item.slot}`);
  slotEl.src = item.file;

  let p = item.points_base;
  if(item.style === currentChar.style) p += 5;
  if(currentChar.colors.includes(item.color)) p += 3;
  score += p;
  updateScore();

  const li = document.createElement('li');
  li.textContent = `${item.slot}: +${p} puntos`;
  document.getElementById('scanned-list').prepend(li);
}

// --- Escaneo QR ---
function onScanSuccess(decodedText){
  const id = decodedText.trim();
  const item = ITEMS[id];
  if(!item){
    alert(`Carta no registrada: ${id}`);
    return;
  }
  applyItem(item);
}

// --- Inicializar lector ---
const html5QrScanner = new Html5QrcodeScanner("qr-reader",{fps:8, qrbox:250});
html5QrScanner.render(onScanSuccess);
