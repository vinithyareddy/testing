focusOnCountry(country: CountrySkill) {
  if (!country) return;
  this.isFocusing = true;

  // 1. Base position (globe local space)
  const basePos = this.latLngToVector3(country.lat, country.lng, RADIUS);

  // 2. World position after current globe rotation
  const worldPos = basePos.clone().applyMatrix4(this.globeGroup.matrixWorld);

  // 3. Current distance of camera from center
  const distance = this.camera.position.length();

  // 4. Move camera so that it looks at this country, preserving zoom
  const dir = worldPos.clone().normalize();
  this.camera.position.copy(dir.multiplyScalar(distance));

  // 5. Always orbit around globe center
  this.controls.target.set(0, 0, 0);
  this.controls.update();

  // 6. Temporary highlight marker
  const highlight = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  highlight.position.copy(basePos);
  this.globeGroup.add(highlight);

  setTimeout(() => {
    this.globeGroup.remove(highlight);
    this.isFocusing = false;
  }, 2000);
}
