focusOnCountry(country: CountrySkill) {
  if (!country) return;

  this.isFocusing = true;

  // base position from lat/lng (unrotated)
  const basePos = this.latLngToVector3(country.lat, country.lng, RADIUS);

  // ✅ apply current globe rotation so it matches what you see
  const rotatedPos = basePos.clone().applyMatrix4(this.globeGroup.matrix);

  // current camera distance (keep same zoom)
  const distance = this.camera.position.length();

  // set OrbitControls target
  this.controls.target.copy(rotatedPos);

  // move camera to same relative direction, preserving distance
  const newCamPos = rotatedPos.clone().normalize().multiplyScalar(distance);
  this.camera.position.copy(newCamPos);

  this.controls.update();

  // highlight marker at rotated position
  const highlight = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  highlight.position.copy(rotatedPos);
  this.scene.add(highlight);

  setTimeout(() => {
    this.scene.remove(highlight);
    this.isFocusing = false;
  }, 2000);
}
