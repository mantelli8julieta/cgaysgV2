let micTP1, fftTP1;
let micOn = false;
let formasTP1 = [];
let imagenesTP1 = [];
let ultimaFormaTP1 = null;
let ultimaFormaH = null;

let ultimaDibujada = 0;
let intervaloMin = 150;

let alternarDir = true;

function preload() {
  for (let i = 1; i <= 6; i++) {
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

  // Generar formas mientras hay voz activa
  if (vol > 0.009) {
    let x, y, angulo;
if (millis() - ultimaDibujada > intervaloMin) {
    if (alternarDir) {
      // Verticales
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

      ultimaFormaTP1 = generarForma(x, y, direccion, 0); // sin rotación
    } else {
      // Horizontales
      if (!ultimaFormaH || ultimaFormaH.terminada()) {
        x = width / 2;
        y = height / 2;
      } else {
        x = ultimaFormaH.x;
        y = ultimaFormaH.y;
      }

      let direccion = random([
        { dx: 40, dy: 0 },
        { dx: -40, dy: 0 }
      ]);

      ultimaFormaH = generarForma(x, y, direccion, PI); // rotación 180°
    }

    alternarDir = !alternarDir;
    ultimaDibujada = millis();
  }
}

  // for de dibujo y actualización  
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
  let nuevaY = constrain(y + direccion.dy + random(-5, 5), 50, height - 50);
  let img = random(imagenesTP1);
  let nueva = new FormaTP1(nuevaX, nuevaY, img, angulo);
  formasTP1.push(nueva);
  return nueva;
}

class FormaTP1 {
  constructor(x, y, img, angulo) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.alpha = 255;
    this.escala = random(0.2, 0.5);
    this.angulo = angulo || HALF_PI * random (0,0.5); 
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
    rotate(this.angulo); // Aplicar rotación
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
