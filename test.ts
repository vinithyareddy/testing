const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(mouse, this.camera);

// ✅ check against country polygons instead of whole earth
const intersects = raycaster.intersectObjects(
  this.globe.polygonsData().map((f: any) => f.__threeObj)
);

if (intersects.length > 0) {
  this.isFocusing = true; // pause rotation
} else {
  this.isFocusing = false; // resume rotation
}


renderer.domElement.addEventListener('mouseleave', () => {
  this.isFocusing = false; // resume rotation when mouse leaves globe
  tooltip.style.display = 'none';
});
