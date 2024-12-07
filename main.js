import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Сцены
const scenes = [];
const canvas = document.getElementById('c');
const content = document.getElementById('content');

// Отрисовщик
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setClearColor(0xffffff, 1);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setAnimationLoop(animate);

function updateSize() {

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (canvas.width !== width || canvas.height !== height) {

    renderer.setSize(width, height, false);

  }

}

// Фигуры
const geometries = [
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.SphereGeometry(0.5, 12, 8),
  new THREE.DodecahedronGeometry(0.5),
  new THREE.CylinderGeometry(0.5, 0.5, 1, 12),
  new THREE.CapsuleGeometry(0.3, 0.7, 1, 10),
  new THREE.ConeGeometry(0.2, 1, 12)
];

// Множество фигур
for (let i = 0; i < 100; i++) {

  // Сцена
  const scene = new THREE.Scene();
  const element = document.createElement('div');

  element.className = 'list-item';
  const sceneElement = document.createElement('div');

  element.appendChild(sceneElement);

  const descriptionElement = document.createElement('div');
  descriptionElement.innerText = 'Фигура ' + (i + 1);
  descriptionElement.style.textAlign = 'center';
  element.appendChild(descriptionElement);

  scene.userData.element = sceneElement;
  content.appendChild(element);

  // Камера
  const camera = new THREE.PerspectiveCamera(50, 1, 1, 10);
  camera.position.z = 2;
  scene.userData.camera = camera;

  // OrbitControls
  const controls = new OrbitControls(scene.userData.camera, scene.userData.element);
  controls.minDistance = 2;
  controls.maxDistance = 5;
  controls.enablePan = false;
  controls.enableZoom = false;
  scene.userData.controls = controls;

  const geometry = geometries[geometries.length * Math.random() | 0];

  const material = new THREE.MeshStandardMaterial({

    color: new THREE.Color().setHSL(Math.random(), 1, 0.75, THREE.SRGBColorSpace),
    roughness: 0.5,
    metalness: 0,
    flatShading: true

  });

  scene.add(new THREE.Mesh(geometry, material));

  // Освещение
  scene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444, 3));

  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(1, 1, 1);
  scene.add(light);

  scenes.push(scene);

}

// Анимация
function animate() {

  updateSize();

  canvas.style.transform = `translateY(${window.scrollY}px)`;

  renderer.setClearColor(0xffffff);
  renderer.setScissorTest(false);
  renderer.clear();

  renderer.setClearColor(0xe0e0e0);
  renderer.setScissorTest(true);

  scenes.forEach(function (scene) {

    scene.children[0].rotation.y = Date.now() * 0.001;
    const element = scene.userData.element;

    const rect = element.getBoundingClientRect();

    if (rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
      rect.right < 0 || rect.left > renderer.domElement.clientWidth) {

      return;

    }

    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    const left = rect.left;
    const bottom = renderer.domElement.clientHeight - rect.bottom;

    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);

    const camera = scene.userData.camera;

    renderer.render(scene, camera);

  });

}