private createIconSprite(
  color: string = '#0071bc',
  scaleX: number = 8,
  scaleY: number = 12
): THREE.Sprite {
  const size = 128; // fixed hi-res canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = size;
  canvas.height = size;

  // Draw icon in white (we will tint later)
  ctx.font = `900 ${size - 16}px "Font Awesome 6 Pro"`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('\uf3c5', size / 2, size / 2); // fa-location-dot / map-marker-alt

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    color: new THREE.Color(color) // apply tint here
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(scaleX, scaleY, 1); // size on globe
  return sprite;
}


// small red pin
const pin = this.createIconSprite('#ff0000', 6, 9);

// larger green pin
const pin2 = this.createIconSprite('#28a745', 10, 15);
