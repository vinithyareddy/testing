private createSvgIconSprite(path: string, scale: number = 10): THREE.Sprite {
  const loader = new THREE.TextureLoader();
  const texture = loader.load(path);

  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(scale, scale, 1);
  return sprite;
}

const pin = this.createSvgIconSprite('assets/icons/map-marker-alt.svg', 15);
pin.position.copy(basePos.clone().normalize().multiplyScalar(RADIUS + 2));
this.globeGroup.add(pin);
