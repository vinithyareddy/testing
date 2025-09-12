private createTextSprite(text: string, color: string = '#000000', fontSize: number = 28): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;

  // Set font
  context.font = `${fontSize}px "Arial", "Helvetica", sans-serif`;
  const textMetrics = context.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = fontSize;

  // Add padding
  const padding = 6;
  canvas.width = textWidth + padding * 2;
  canvas.height = textHeight + padding * 2;

  // Reset scale after resizing
  const ctx = canvas.getContext('2d')!;
  ctx.font = `${fontSize}px "Arial", "Helvetica", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;

  // Draw clean text (no shadow, no background)
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  // Convert to texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter; // keep crisp edges
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false
  });

  const sprite = new THREE.Sprite(material);

  // Scale uniformly
  const scaleFactor = 0.25; // adjust size of labels
  sprite.scale.set(canvas.width * scaleFactor / 100, canvas.height * scaleFactor / 100, 1);

  return sprite;
}


const label = this.createTextSprite(country.code, '#000000', 26);
