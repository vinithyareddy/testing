import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const camera = new THREE.PerspectiveCamera(
  75,
  globeDiv.offsetWidth / globeDiv.offsetHeight,
  0.1,
  1000
);
camera.position.z = 170;

// 👇 add this
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.enableZoom = false; // keep zoom disabled like in your screenshots
controls.rotateSpeed = 0.6;

// Center initial view on North & South America
const americasPOV = { lat: 15, lng: -80, altitude: 2.2 };
if ((globe as any).pointOfView) {
  (globe as any).pointOfView(americasPOV);
} else if ((globe as any).setPointOfView) {
  (globe as any).setPointOfView(americasPOV);
}
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();   // 👈 this makes dragging smooth
  renderer.render(scene, camera);
};
animate();
