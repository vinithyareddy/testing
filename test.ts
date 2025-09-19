private createIconSprite(
  color: string = '#0071bc',
  scaleX: number = 8,
  scaleY: number = 12
): THREE.Sprite {
  const size = 128; // hi-res canvas so icon is sharp
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = size;
  canvas.height = size;

  // Draw icon directly in the given color
  ctx.font = `900 ${size - 16}px "Font Awesome 6 Pro"`;
  ctx.fillStyle = color;  // ✅ use passed color here
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('\uf3c5', size / 2, size / 2); // fa-location-dot / fa-map-marker-alt

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  // No need to re-tint in material
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(scaleX, scaleY, 1); // final size on globe
  return sprite;
}
