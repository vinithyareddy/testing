focusOnCountry(country: CountrySkill) {
  if (!country) return;

  this.isFocusing = true;

  // base position from lat/lng
  const basePos = this.latLngToVector3(country.lat, country.lng, RADIUS);

  // adjust for current globe rotation
  const worldPos = basePos.clone().applyMatrix4(this.globeGroup.matrixWorld);

  // ✅ only change the controls target
  this.controls.target.copy(worldPos);

  // keep camera distance (don’t change zoom)
  const currentDistance = this.camera.position.length();
  this.camera.position.copy(
    worldPos.clone().normalize().multiplyScalar(currentDistance)
  );

  this.controls.update();

  // highlight sphere at correct location
  const highlight = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  highlight.position.copy(worldPos);
  this.scene.add(highlight);

  setTimeout(() => {
    this.scene.remove(highlight);
    this.isFocusing = false;
  }, 2000);
}
