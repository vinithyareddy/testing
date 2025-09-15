focusOnCountry(country: CountrySkill) {
  if (!country) return;

  this.isFocusing = true;

  // ✅ use original lat/lng → vector (no matrix applied)
  const countryPos = this.latLngToVector3(country.lat, country.lng, RADIUS);

  // current camera distance from origin (keep same zoom level)
  const distance = this.camera.position.length();

  // set OrbitControls target
  this.controls.target.copy(countryPos);

  // position camera along the same direction as countryPos
  const newCamPos = countryPos.clone().normalize().multiplyScalar(distance);
  this.camera.position.copy(newCamPos);

  this.controls.update();

  // highlight marker at correct globe surface
  const highlight = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  highlight.position.copy(countryPos);
  this.scene.add(highlight);

  setTimeout(() => {
    this.scene.remove(highlight);
    this.isFocusing = false;
  }, 2000);
}
