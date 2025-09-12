private createTextSprite(text: string, color: string = '#ffffff', fontSize: number = 18): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;

  context.font = `bold ${fontSize}px Arial, sans-serif`;
  const textMetrics = context.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = fontSize;

  const padding = 4;
  canvas.width = textWidth + padding * 2;
  canvas.height = textHeight + padding * 2;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = `bold ${fontSize}px Arial, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = color;
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);

  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,   // ✅ always render on top
    depthWrite: false   // ✅ don’t overwrite depth buffer
  });

  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.renderOrder = 999; // ✅ force labels on top of globe

  const baseScale = 3;
  const scaleX = Math.max(baseScale, textWidth * 0.015);
  const scaleY = baseScale * 0.8;
  sprite.scale.set(scaleX, scaleY, 1);

  return sprite;
}
