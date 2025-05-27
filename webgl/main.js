import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();

loader.load('image.png', (texture) => {
  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const infoX = document.querySelector('.x');
  const infoY = document.querySelector('.y');
  const infoZ = document.querySelector('.z');
  const fpsText = document.getElementById('fpsText');
  const creatorText = document.getElementById('creator');
  const intro = document.getElementById('intro');

  let frameCount = 0;
  let lastTime = performance.now();

  setTimeout(() => {
    intro.style.opacity = '0';
    setTimeout(() => {
      intro.style.display = 'none';
      creatorText.style.opacity = '0.3';
    }, 1000);
  }, 2000);

  function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.002;
    cube.rotation.y += 0.003;
    cube.rotation.z += 0.004;

    infoX.textContent = `X: ${(cube.rotation.x * 180 / Math.PI).toFixed(1)}°`;
    infoY.textContent = `Y: ${(cube.rotation.y * 180 / Math.PI).toFixed(1)}°`;
    infoZ.textContent = `Z: ${(cube.rotation.z * 180 / Math.PI).toFixed(1)}°`;

    const now = performance.now();
    const elapsed = now - lastTime;

    frameCount++;
    if (elapsed >= 100) {
      const fps = Math.round((frameCount * 1000) / elapsed);
      fpsText.textContent = `FPS: ${fps}`;
      frameCount = 0;
      lastTime = now;
    }

    renderer.render(scene, camera);
  }

  animate();
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
