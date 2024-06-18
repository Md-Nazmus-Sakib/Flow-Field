const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Canvas Settings
ctx.fillStyle = "white";
ctx.strokeStyle = "white";
ctx.lineWidth = 1;

// Particle class to handle individual particles
class Particle {
  constructor(effect) {
    this.effect = effect;
    this.x = Math.floor(Math.random() * this.effect.width); // Random initial x position
    this.y = Math.floor(Math.random() * this.effect.height); // Random initial y position
    this.speedX = 0;
    this.speedY = 0;
    this.speedModifier = Math.floor(Math.random() * 5 + 1); // Random speed modifier between 1 and 5
    this.history = [{ x: this.x, y: this.y }]; // Initial position in history
    this.maxLength = Math.floor(Math.random() * 200 + 10); // Random max length of history between 10 and 210
    this.angle = 0;
    this.timer = this.maxLength * 2; // Timer to control particle lifecycle
    this.colors = ["#4c0226b", "#730d9c", "#9622c7", "#b44ae0", "#cd72f2"]; // Array of colors
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)]; // Random color selection
  }

  // Draw the particle trail
  draw(context) {
    context.beginPath();
    context.moveTo(this.history[0].x, this.history[0].y);
    for (let i = 0; i < this.history.length; i++) {
      context.lineTo(this.history[i].x, this.history[i].y);
    }
    context.strokeStyle = this.color;
    context.stroke();
  }

  // Update particle position and history
  update() {
    this.timer--;
    if (this.timer >= 1) {
      let x = Math.floor(this.x / this.effect.cellSize);
      let y = Math.floor(this.y / this.effect.cellSize);
      let index = y * this.effect.cols + x; // Calculate index in the flow field
      this.angle = this.effect.flowField[index]; // Get angle from flow field

      this.speedX = Math.cos(this.angle);
      this.speedY = Math.sin(this.angle);
      this.x += this.speedX * this.speedModifier; // Update x position
      this.y += this.speedY * this.speedModifier; // Update y position

      this.history.push({ x: this.x, y: this.y }); // Add new position to history
      if (this.history.length > this.maxLength) {
        this.history.shift(); // Remove oldest position if history is too long
      }
    } else if (this.history.length > 1) {
      this.history.shift(); // Continue shrinking history after timer runs out
    } else {
      this.reset(); // Reset particle when history is empty
    }
  }

  // Reset particle to a new random position
  reset() {
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.history = [{ x: this.x, y: this.y }];
    this.timer = this.maxLength * 2;
  }
}

// Effect class to manage particles and flow field
class Effect {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.particles = [];
    this.numberOfParticles = 1000; // Number of particles
    this.cellSize = 30; // Size of each cell in the flow field
    this.rows = Math.floor(this.height / this.cellSize);
    this.cols = Math.floor(this.width / this.cellSize);
    this.flowField = [];
    this.curve = 5; // Curve factor for flow field calculation
    this.zoom = 0.09; // Zoom factor for flow field calculation
    this.init();

    // Resize event listener to adjust canvas size
    window.addEventListener("resize", (e) => {
      this.resize(e.target.innerWidth, e.target.innerHeight);
    });
  }

  // Initialize the effect by creating the flow field and particles
  init() {
    // Create flow field
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let angle =
          (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve;
        this.flowField.push(angle);
      }
    }

    // Create particles
    this.particles = [];
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
  }

  // Resize the canvas and reinitialize the effect
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.init();
  }

  // Render all particles
  render(context) {
    this.particles.forEach((particle) => {
      particle.draw(context);
      particle.update();
    });
  }
}

// Create the effect and start the animation loop
const effect = new Effect(canvas);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.render(ctx);
  requestAnimationFrame(animate);
}
animate();
