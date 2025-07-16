let micTP1, fftTP1;
let micOn = false;
let formasTP1 = [];
let imagenesTP1 = [];
let ultimaFormaTP1 = null;
let ultimaFormaH = null;

let alternarDir = true;

let haySonido = false;
let umbralTiempo = 3;
let tiempoDeSonido = 0;

function preload() {
  for (let i = 1; i <= 5; i++) {
    imagenesTP1.push(loadImage(`formas/forma${i}.png`));
  }
}

function setup() {
  createCanvas(800, 600);
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
      console.log("empieza el input");
      tiempoDeSonido = millis();
    }
    haySonido = true;
  }

  if (vol <= 0.07) {
    let segundosDeSonido = (millis() - tiempoDeSonido) / 1000.0;
    if (haySonido && segundosDeSonido > umbralTiempo) {
      console.log("se termina el input");
      let cantidad = map(segundosDeSonido, 3, 10, 2, 20);

      for (let i = 0; i < cantidad; i++) {    
        let x, y, angulo;
        // se alterna entre ambas direcciones
        if (alternarDir) {
          // generación d verticales
          if (!ultimaFormaTP1 || ultimaFormaTP1.terminada()) {
            x = width / 2;
            y = height * 0.9;
          } else {
            x = ultimaFormaTP1.x;
            y = ultimaFormaTP1.y;
          }

          let direccion = random([
            { dx: 0, dy: -40 },
            { dx: 40, dy: -40 },
            { dx: -40, dy: -40 }
          ]);

          ultimaFormaTP1 = generarForma(x, y, direccion);
        } else {
          // se generan ramas horizontales
          if (!ultimaFormaH || ultimaFormaH.terminada()) {
            x = width / 2;
            y = height / 2;
          } else {
            x = ultimaFormaH.x;
            y = ultimaFormaH.y;
            angulo = HALF_PI;
          }

          let direccion = random([
            { dx: 40, dy: 0 },
            { dx: -40, dy: 0 }
          ]);

           let nueva = generarForma(x, y, direccion, PI);
    formasTP1.push(nueva);
    ultimaFormaH = nueva;
        }

        alternarDir = !alternarDir;
      }

      console.log("Cantidad de trazos: " + cantidad);
    }
    haySonido = false;
  }

  // dibujo d formas
  for (let i = formasTP1.length - 1; i >= 0; i--) {
    formasTP1[i].actualizar();
    formasTP1[i].mostrar();
    if (formasTP1[i].terminada()) formasTP1.splice(i, 1);
  }

  if (formasTP1.length === 0) { 
    ultimaFormaTP1 = null;
    ultimaFormaH = null;
  }
}

function generarForma(x, y, direccion, angulo) {

  let nuevaX = constrain(x + direccion.dx + random(-5, 5), 50, width - 50);
  let nuevaY = constrain(y + direccion.dy + random(-10, 10), 50, height - 50);
  let img = random(imagenesTP1);
  let nueva = new FormaTP1(nuevaX, nuevaY, img, angulo);
  formasTP1.push(nueva);
  return new FormaTP1(nuevaX, nuevaY, img, angulo);
}

class FormaTP1 {
  constructor(x, y, img, angulo) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.alpha = 255;
    this.escala = random(0.2, 0.5);
    this.angulo = angulo;
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
