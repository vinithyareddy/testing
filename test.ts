private createTextSprite(text: string, fontSize: number = 28): THREE.Sprite {
  // Step 1: prepare canvas
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;

  context.font = `bold ${fontSize}px Arial, sans-serif`;
  const textMetrics = context.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = fontSize;

  const padding = 8;
  canvas.width = textWidth + padding * 2;
  canvas.height = textHeight + padding * 2;

  const ctx = canvas.getContext('2d')!;
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Step 2: white outline / stroke
  ctx.lineWidth = 6; // thickness of white stroke
  ctx.strokeStyle = '#ffffff';
  ctx.strokeText(text, canvas.width / 2, canvas.height / 2);

  // Step 3: black fill text
  ctx.fillStyle = '#000000';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  // Step 4: turn into texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: true,
    depthWrite: false
  });

  const sprite = new THREE.Sprite(material);

  // Step 5: scale (linked to fontSize)
  const scaleFactor = fontSize * 0.12;
  sprite.scale.set(scaleFactor, scaleFactor * 0.5, 1);

  return sprite;
}
