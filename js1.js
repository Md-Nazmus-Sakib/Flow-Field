const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Canvas Settings
ctx.fillStyle = "white";
//ctx.arc(x,y,pixel,start,end)
// ctx.arc(100, 100, 50, 0, Math.PI * 2);
// ctx.fill();
ctx.strokeStyle = "white";
ctx.lineWidth = 1;

class Particle {
  constructor(effect) {
    this.effect = effect;
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.speedX = Math.random() * 5 - 2.5;
    this.speedY = Math.random() * 5 - 2.5;
    this.history = [{ x: this.x, y: this.y }];
    this.maxLength = Math.floor(Math.random() * 200 + 10);
    this.angle = 0;
  }
  draw(context) {
    context.fillRect(this.x, this.y, 10, 10);
    context.beginPath();
    context.moveTo(this.history[0].x, this.history[0].y);
    for (let i = 0; i < this.history.length; i++) {
      context.lineTo(this.history[i].x, this.history[i].y);
    }
    context.stroke();
  }
  update() {
    this.angle += 0.5;
    this.x += this.speedX * Math.sin(this.angle) * 20;
    this.y += this.speedY * Math.cos(this.angle) * 20;
    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > this.maxLength) {
      this.history.shift();
    }
  }
}
class Effect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.particles = [];
    this.numberOfParticles = 50;
    this.init();
  }
  init() {
    //create Particles
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
  }
  render(context) {
    this.particles.forEach((particle) => {
      particle.draw(context);
      particle.update();
    });
  }
}

const effect = new Effect(canvas.width, canvas.height);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.render(ctx);
  requestAnimationFrame(animate);
}
animate();
