focusOnCountry(country: CountrySkill) {
  if (!country) return;
  this.isFocusing = true;

  const basePos = this.latLngToVector3(country.lat, country.lng, RADIUS);

  // Create pin sprite instead of red dot
  const textureLoader = new THREE.TextureLoader();
  const pinTexture = textureLoader.load('assets/icons/pin.png');

  const material = new THREE.SpriteMaterial({
    map: pinTexture,
    transparent: true
  });

  const pin = new THREE.Sprite(material);
  pin.scale.set(10, 15, 1); // adjust size to look like your image
  pin.position.copy(basePos.clone().normalize().multiplyScalar(RADIUS + 2));

  this.globeGroup.add(pin);

  // Focus camera
  const worldPos = basePos.clone().applyMatrix4(this.globeGroup.matrixWorld);
  const distance = this.camera.position.length();
  const dir = worldPos.clone().normalize();
  this.camera.position.copy(dir.multiplyScalar(distance));
  this.controls.target.set(0, 0, 0);
  this.controls.update();

  // Remove pin after 2 seconds
  setTimeout(() => {
    this.globeGroup.remove(pin);
    this.isFocusing = false;
  }, 2000);
}
