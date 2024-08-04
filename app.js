// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Define heart shape function
function heartShape(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return { x: x * 1.2, y: y * 1.2 }; // Adjust for a fatter heart shape
}

// Initialize particles
const particleCount = 1000; // Reduced particle count for better performance
const particles = new THREE.Group();
scene.add(particles);

// Function to create sprite material with a specified color
function createSpriteMaterial(color) {
  return new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png'),
    color: color
  });
}

for (let i = 0; i < particleCount; i++) {
  const t = Math.random() * Math.PI * 2;
  const pos = heartShape(t);

  // Assign color: full red (love red)
  const color = 0xff0000;
  const spriteMaterial = createSpriteMaterial(color);

  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(0.3, 0.3, 0.3); // Scale the circle
  sprite.position.set(
    pos.x + (Math.random() - 0.5) * 3, // Random initial x near the heart shape
    pos.y + (Math.random() - 0.5) * 3, // Random initial y near the heart shape
    Math.random() * 10 - 5 // Random z
  );

  const targetPos = heartShape(Math.random() * Math.PI * 2); // Random target positions along the heart shape
  sprite.targetPosition = new THREE.Vector3(
    targetPos.x + (Math.random() - 0.5) * 3, // Add some randomness
    targetPos.y + (Math.random() - 0.5) * 3, // Add some randomness
    Math.random() * 10 - 5 // Same z range for target
  );

  particles.add(sprite);
}

// Center the heart shape in the viewport
camera.position.z = 50;

// Handle mouse movement
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Adjust renderer size on window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Function to update the glowing effect on letters
function updateTextGlow() {
  const letters = document.querySelectorAll('.letter');
  let activeIndex = 0;

  setInterval(() => {
    letters.forEach((letter, index) => {
      if (index === activeIndex) {
        letter.classList.add('glow');
      } else {
        letter.classList.remove('glow');
      }
    });

    activeIndex = (activeIndex + 1) % letters.length;
  }, 1000); // Change every 1 second
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Transition particles to heart shape
  particles.children.forEach(sprite => {
    sprite.position.lerp(sprite.targetPosition, 0.05);
  });

  // Rotate particles based on mouse position
  particles.rotation.y = mouseX * Math.PI;
  particles.rotation.x = mouseY * Math.PI;

  // Update the position of the text to follow the rotation
  const textElement = document.getElementById('text');
  textElement.style.transform = `translate(-50%, -50%) rotateX(${particles.rotation.x}rad) rotateY(${particles.rotation.y}rad)`;

  renderer.render(scene, camera);
}

updateTextGlow();
animate();

