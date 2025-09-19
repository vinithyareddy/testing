private createIconSprite(
  color: string = '#0071bc',
  size: number = 48
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = size;
  canvas.height = size;

  // Solid weight (900) to render fas icons
  ctx.font = `900 ${size - 8}px "Font Awesome 5 Free"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;

  // Unicode for map-marker-alt (fa-map-marker-alt = \uf3c5)
  ctx.fillText('\uf3c5', size / 2, size / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(8, 12, 1); // tweak to size properly
  return sprite;
}
