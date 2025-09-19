private createIconSprite(
  iconClass: string = 'fas fa-map-marker-alt',
  color: string = '#0071bc',
  size: number = 48
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = size;
  canvas.height = size;

  // Use FontAwesome font
  ctx.font = `${size - 8}px "Font Awesome 5 Free"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;

  // Unicode for map-marker-alt = \uf3c5
  ctx.fillText('\uf3c5', size / 2, size / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(8, 12, 1); // adjust size on globe
  return sprite;
}


const pin = this.createIconSprite('fas fa-map-marker-alt', '#0071bc', 64);
pin.position.copy(basePos.clone().normalize().multiplyScalar(RADIUS + 2));
this.globeGroup.add(pin);

setTimeout(() => {
  this.globeGroup.remove(pin);
  this.isFocusing = false;
}, 2000);
