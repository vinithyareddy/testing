// Enable mouse rotation
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;   // smooth motion
controls.enableZoom = true;      // allow zoom
controls.rotateSpeed = 0.6;
controls.zoomSpeed = 1.2;
