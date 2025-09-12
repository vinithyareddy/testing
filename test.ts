private addCountryLabels() {
  if (this.labelGroup) this.scene.remove(this.labelGroup);
  this.labelGroup = new THREE.Group();
  this.scene.add(this.labelGroup);

  this.countriesList.forEach(country => {
    if (country.position) {
      // Show full country name instead of just code
      const label = this.createTextSprite(country.country, '#ffffff', 26);

      const labelPosition = country.position.clone().normalize();
      labelPosition.multiplyScalar(RADIUS + 0.5);

      label.position.copy(labelPosition);
      (label as any).userData = { country };

      this.labelGroup.add(label);
    }
  });
}


private createTextSprite(text: string, color: string = '#ffffff', fontSize: number = 22): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;

  const padding = 12;
  context.font = `bold ${fontSize}px Arial, sans-serif`;
  const textMetrics = context.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = fontSize;

  canvas.width = textWidth + (padding * 2);
  canvas.height = textHeight + (padding * 2);

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
    depthTest: true,
    depthWrite: false
  });

  const sprite = new THREE.Sprite(spriteMaterial);

  // same scaling for all labels
  const scaleFactor = 6;
  sprite.scale.set(scaleFactor, scaleFactor * 0.5, 1);

  return sprite;
}
