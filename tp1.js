let micTP1, fftTP1;
let micOn = false;
let formasTP1 = [];
let imagenesTP1 = [];
let ultimaFormaTP1 = null;

let haySonido = false;
let umbralTiempo = 3;
let tiempoDeSonido = 0;

function preload() {
  for (let i = 1; i <= 3; i++) {
    imagenesTP1.push(loadImage(`formas/forma${i}.png`));
  }
}
 
function setup() {
  createCanvas(900, 800);
  micTP1 = new p5.AudioIn();
  fftTP1 = new p5.FFT();
  fftTP1.setInput(micTP1);
  imageMode(CENTER);
}

function draw() {
  background(240, 227, 206, 10);
  let vol = micTP1.getLevel();
console.log("volumen es:" + vol);
 if (vol > 0.005) {
    if (!haySonido) {
      console.log("empieza el sonido");
      tiempoDeSonido = millis();
    }
    haySonido = true;
  }

   if (vol <= 0.07) {
    let segundosDeSonido = (millis() - tiempoDeSonido) / 1000.0;
    if (haySonido && segundosDeSonido > umbralTiempo) {
console.log("se termina el sonido");
      //agregar trazos con una cantidad definidad por el tiempoDeSonido
      let cantidad = map(segundosDeSonido, 3, 10, 2, 20);
let x, y;
 for(let i=0;i<cantidad;i++){
    if (!ultimaFormaTP1 || ultimaFormaTP1.terminada()) {  // Si no hay forma antes arrancamod desde el centro
      x = width / 2;
      y = height * 0.9; // para que empiece desde abajo
    } else {
      x = ultimaFormaTP1.x;
      y = ultimaFormaTP1.y;
    }
    
    let direccion = random([
      { dx: 0, dy: -40 },   // las de arriba
      { dx: 40, dy: -40 },  // diagonal arriba deecha
      { dx: -40, dy: -40 }, // diagnal arriba izquierda
      { dx: 40, dy: 0 },    // der
      { dx: -40, dy: 0 },   // izqui
    ]);

    let nuevaX = constrain(x + direccion.dx + random(-5, 5), 50, width - 50);
    let nuevaY = constrain(y + direccion.dy + random(-10, 10), 50, height - 50);

    let img = random(imagenesTP1);
    let nueva = new FormaTP1(nuevaX, nuevaY, img);
    formasTP1.push(nueva);
    ultimaFormaTP1 = nueva;
       }
      console.log("Cantidad de trazos: " + cantidad);
    }
    haySonido = false;
  }

  if (vol >= 0.05) {
    
  }

  for (let i = formasTP1.length - 1; i >= 0; i--) {
    formasTP1[i].actualizar();
    formasTP1[i].mostrar();
    if (formasTP1[i].terminada()) formasTP1.splice(i, 1);
  }

  if (formasTP1.length === 0) {
    ultimaFormaTP1 = null;
  }
}

class FormaTP1 {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.alpha = 255;
    this.escala = random(0.3, 0.8);
  }

  actualizar() {
    if (!micTP1.enabled || micTP1.getLevel() < 0.05) {
      this.alpha -= 0.005;
    }
  }

  mostrar() {
    tint(255, this.alpha);
    push();
    translate(this.x, this.y);
    scale(this.escala);
    image(this.img, 0, 0);
    pop();
  }

  terminada() {
    return this.alpha <= 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  userStartAudio();
  if (!micOn) {
    micOn = true;
    micTP1.start();
  }
}
