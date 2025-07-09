
let micTP1, fftTP1;
let micOn = false;
var espectro;
const umbral = 0.04;

let formasTP1 = [];
let imagenesTP1 = [];
let ultimaFormaTP1 = null;

function preload() {
  for (let i = 1; i <= 3; i++) {
    imagenesTP1.push(loadImage(`forma${i}.png`));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  micTP1 = new p5.AudioIn();

  fftTP1 = new p5.FFT();
  fftTP1.setInput(micTP1);
  imageMode(CENTER);
}

function draw() {
  background(240, 227, 206, 10);
  let vol = micTP1.getLevel();

  console.log("la amplitud es:" + vol);
  console.log("micOn es:" + micOn);

  if (vol >= 0.05) {
    let zona = 1;
    if (vol >= 0.08) zona = 2;
    if (vol >= 0.12) zona = 3;

    let x, y;
    if (!ultimaFormaTP1 || ultimaFormaTP1.terminada()) {
      if (zona === 1) y = random(height * 2 / 3, height);
      if (zona === 2) y = random(height / 3, height * 2 / 3);
      if (zona === 3) y = random(0, height / 3);
      x = random(width);
    } else {
      x = ultimaFormaTP1.x + random(-30, 30);
      y = ultimaFormaTP1.y - random(20, 50);
    }

    let img = random(imagenesTP1);
    let nueva = new FormaTP1(x, y, img);
    formasTP1.push(nueva);
    ultimaFormaTP1 = nueva;
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
    this.alpha -= 3;
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

function mousePressed(){

  if (micOn == false){
    micOn = true;
    micTP1.start();
 
  }
}
