import * as THREE from './vendor/three.module.js';

const openButton = document.getElementById('jord-open');
const panel = document.getElementById('jord-panel');
const closeButton = document.getElementById('jord-close');
const nextButton = document.getElementById('jord-next');
const tip = document.getElementById('jord-tip');
const tipLink = document.getElementById('jord-tip-link');
const musicButton = document.getElementById('music-toggle');
const stage = document.querySelector('.jord-stage');
const canvas = document.getElementById('jord-canvas');

const tips = [
  ['Откройте примеры сайтов: оба демо работают и на телефоне.', '#works', 'Смотреть примеры ↗'],
  ['На главной есть короткое описание услуг: сайт-визитка и лендинг.', '#services', 'Смотреть услуги ↗'],
  ['Работа проходит в три шага: задача, создание страницы и проверка.', '#process', 'Как я работаю ↗'],
  ['Расскажите о задаче письмом. Георгий ответит и предложит следующий шаг.', '#contact', 'Связаться ↗']
];
let tipIndex = 0;
let popUntil = 0;
function setTip(index) {
  tipIndex = (index + tips.length) % tips.length;
  const [message, href, label] = tips[tipIndex];
  tip.textContent = message;
  tipLink.href = href;
  tipLink.textContent = label;
}
function showPanel(visible) {
  panel.hidden = !visible;
  openButton.setAttribute('aria-expanded', String(visible));
  openButton.setAttribute('aria-label', visible ? 'Закрыть совет Джорджа вайбкодера' : 'Открыть совет Джорджа вайбкодера');
}
openButton.addEventListener('click', () => { popUntil = performance.now() + 850; showPanel(panel.hidden); });
closeButton.addEventListener('click', () => showPanel(false));
nextButton.addEventListener('click', () => { popUntil = performance.now() + 850; setTip(tipIndex + 1); });
tipLink.addEventListener('click', () => showPanel(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !panel.hidden) showPanel(false);
});

// Quiet, generated ambient notes. Sound starts only after a direct click.
const AudioContextClass = window.AudioContext || window.webkitAudioContext;
let audioContext;
let musicTimer;
let noteNumber = 0;
const notes = [220, 261.63, 329.63, 392, 329.63, 261.63, 246.94, 293.66];
function playNote() {
  if (!audioContext || document.hidden) return;
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(notes[noteNumber++ % notes.length], now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.026, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.57);
}
async function stopMusic() {
  clearInterval(musicTimer);
  musicTimer = undefined;
  musicButton.setAttribute('aria-pressed', 'false');
  musicButton.setAttribute('aria-label', 'Включить фоновую музыку');
  if (audioContext && audioContext.state === 'running') await audioContext.suspend();
}
if (!AudioContextClass) {
  musicButton.disabled = true;
  musicButton.setAttribute('aria-label', 'Музыка не поддерживается браузером');
} else {
  musicButton.addEventListener('click', async () => {
    if (musicTimer) { await stopMusic(); return; }
    try {
      audioContext ||= new AudioContextClass();
      await audioContext.resume();
      musicButton.setAttribute('aria-pressed', 'true');
      musicButton.setAttribute('aria-label', 'Выключить фоновую музыку');
      playNote();
      musicTimer = setInterval(playNote, 480);
    } catch { await stopMusic(); }
  });
}
document.addEventListener('visibilitychange', () => { if (document.hidden && musicTimer) stopMusic(); });

try {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 20);
  camera.position.set(0, 1.04, 3.85);
  camera.lookAt(0, 0.99, 0);
  scene.add(new THREE.AmbientLight(0xffffff, 2.1));
  const key = new THREE.DirectionalLight(0xffffff, 3);
  key.position.set(-2, 4, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0x9d83d9, 2.3);
  rim.position.set(2, 2, -2); scene.add(rim);

  const black = new THREE.MeshStandardMaterial({ color: 0x171719, roughness: 0.82 });
  const hoodie = new THREE.MeshStandardMaterial({ color: 0x232326, roughness: 0.88 });
  const skin = new THREE.MeshStandardMaterial({ color: 0xe7b79e, roughness: 0.85 });
  const hair = new THREE.MeshStandardMaterial({ color: 0x382a26, roughness: 0.95 });
  const shoe = new THREE.MeshStandardMaterial({ color: 0x0d0d10, roughness: 0.75 });
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.65 });
  const accent = new THREE.MeshStandardMaterial({ color: 0xa68ac1, roughness: 0.44, metalness: 0.14 });
  const face = new THREE.MeshStandardMaterial({ color: 0x1f1b1c, roughness: 0.9 });
  const person = new THREE.Group(); scene.add(person);
  function mesh(geometry, material, x, y, z, parent = person) {
    const part = new THREE.Mesh(geometry, material);
    part.position.set(x, y, z); parent.add(part); return part;
  }
  function oval(material, x, y, z, sx, sy, sz, parent = person) {
    const part = mesh(new THREE.SphereGeometry(1, 24, 16), material, x, y, z, parent);
    part.scale.set(sx, sy, sz); return part;
  }
  // A playful bobblehead inspired by the reference: compact body, large bearded face and spring neck.
  const leftLeg = mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.48, 14), black, -0.13, 0.36, 0);
  const rightLeg = mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.48, 14), black, 0.13, 0.36, 0);
  oval(white, -0.13, 0.085, 0.095, 0.16, 0.095, 0.22);
  oval(white, 0.13, 0.085, 0.095, 0.16, 0.095, 0.22);
  oval(hoodie, 0, 0.91, 0, 0.39, 0.38, 0.27);
  oval(black, 0, 1.19, -0.02, 0.29, 0.16, 0.22); // hood
  oval(accent, 0, 0.92, 0.265, 0.075, 0.019, 0.009);
  const leftArm = new THREE.Group(); leftArm.position.set(-0.35, 1.1, 0); person.add(leftArm);
  const rightArm = new THREE.Group(); rightArm.position.set(0.35, 1.1, 0); person.add(rightArm);
  oval(hoodie, -0.10, -0.18, 0, 0.14, 0.26, 0.14, leftArm).rotation.z = -0.25;
  oval(hoodie, 0.10, -0.18, 0, 0.14, 0.26, 0.14, rightArm).rotation.z = 0.25;
  oval(skin, -0.19, -0.41, 0.015, 0.085, 0.09, 0.08, leftArm);
  oval(skin, 0.19, -0.41, 0.015, 0.085, 0.09, 0.08, rightArm);
  const coilPoints = [];
  for (let i = 0; i <= 130; i++) {
    const phase = i / 130;
    coilPoints.push(new THREE.Vector3(Math.cos(phase * Math.PI * 17) * 0.083, 1.17 + phase * 0.23, Math.sin(phase * Math.PI * 17) * 0.083));
  }
  mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(coilPoints), 130, 0.018, 7, false), new THREE.MeshStandardMaterial({ color: 0xb3a8a2, metalness: 0.75, roughness: 0.28 }), 0, 0, 0);
  const head = new THREE.Group(); head.position.set(0, 1.56, 0); head.scale.setScalar(1.25); person.add(head);
  oval(skin, 0, 0, 0, 0.39, 0.39, 0.32, head);
  oval(skin, -0.365, -0.035, 0.005, 0.075, 0.12, 0.07, head);
  oval(skin, 0.365, -0.035, 0.005, 0.075, 0.12, 0.07, head);
  oval(hair, 0, 0.275, -0.025, 0.39, 0.135, 0.31, head); // short hair
  oval(hair, 0, -0.19, 0.11, 0.31, 0.22, 0.24, head); // full beard
  oval(hair, -0.29, -0.105, 0.15, 0.075, 0.20, 0.13, head);
  oval(hair, 0.29, -0.105, 0.15, 0.075, 0.20, 0.13, head);
  oval(hair, -0.135, 0.112, 0.298, 0.11, 0.035, 0.025, head).rotation.z = -0.12;
  oval(hair, 0.135, 0.112, 0.298, 0.11, 0.035, 0.025, head).rotation.z = 0.12;
  const leftEye = oval(white, -0.14, 0.025, 0.317, 0.069, 0.056, 0.021, head);
  const rightEye = oval(white, 0.14, 0.025, 0.317, 0.069, 0.056, 0.021, head);
  const leftPupil = oval(face, -0.14, 0.025, 0.341, 0.027, 0.032, 0.014, head);
  const rightPupil = oval(face, 0.14, 0.025, 0.341, 0.027, 0.032, 0.014, head);
  oval(skin, 0, -0.055, 0.337, 0.077, 0.078, 0.062, head);
  oval(hair, 0, -0.116, 0.329, 0.17, 0.045, 0.03, head); // moustache
  oval(face, 0, -0.187, 0.324, 0.145, 0.056, 0.024, head);
  oval(white, 0, -0.165, 0.348, 0.117, 0.022, 0.012, head); // grin
  const ring = mesh(new THREE.TorusGeometry(0.48, 0.018, 8, 48), accent, 0, 0.17, -0.15, scene);
  ring.rotation.x = 1.32;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animationStart = performance.now();
  let pointerX = 0, pointerY = 0;
  openButton.addEventListener('pointermove', event => {
    const bounds = openButton.getBoundingClientRect();
    pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
    pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
  });
  openButton.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });
  let frame;
  function resize() {
    const width = stage.clientWidth, height = stage.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage); resize();
  function render() {
    if (document.hidden) { frame = undefined; return; }
    const t = (performance.now() - animationStart) / 1000;
    if (!reduceMotion.matches) {
      const pop = Math.max(0, 1 - (popUntil - performance.now()) / 850);
      const bounce = pop < 1 ? Math.sin(pop * Math.PI) : 0;
      person.position.y = Math.sin(t * 2.1) * 0.027 + bounce * 0.15;
      person.rotation.y = Math.sin(t * 0.8) * 0.12;
      head.rotation.y += (pointerX * 0.42 - head.rotation.y) * 0.08;
      head.rotation.x += (-pointerY * 0.3 + Math.sin(t * 1.9) * 0.06 - head.rotation.x) * 0.08;
      head.position.y = 1.56 + Math.sin(t * 2.3) * 0.035 + bounce * 0.06;
      leftPupil.position.x = -0.14 + pointerX * 0.025;
      rightPupil.position.x = 0.14 + pointerX * 0.025;
      leftArm.rotation.x = Math.sin(t * 1.6) * 0.13;
      rightArm.rotation.x = -leftArm.rotation.x;
      rightArm.rotation.z = bounce * 1.1;
      leftLeg.rotation.x = Math.sin(t * 1.6) * 0.035;
      rightLeg.rotation.x = -leftLeg.rotation.x;
      ring.rotation.z = t * 0.38;
    }
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !frame) render(); });
  render();
} catch (error) {
  stage.classList.add('fallback');
  document.querySelector('.jord-fallback').textContent = 'Г';
  console.warn('3D preview unavailable:', error);
}
