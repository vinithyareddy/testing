private createMarkerIcon(
  icon: string = '\uf041', // fa-map-marker unicode
  color: string = '#0071bc', // custom blue
  fontSize: number = 64
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;

  canvas.width = fontSize * 2;
  canvas.height = fontSize * 2;

  // Font Awesome 5 Free (needs CSS loaded in index.html)
  context.font = `${fontSize}px "Font Awesome 5 Free"`;
  context.fillStyle = color;
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // draw icon (\uf041 is fa-map-marker)
  context.fillText(icon, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(10, 15, 1); // adjust size
  return sprite;
}



const marker = this.createMarkerIcon('\uf041', '#0071bc', 80); 
marker.position.copy(basePos.clone().normalize().multiplyScalar(RADIUS + 2));
this.globeGroup.add(marker);

setTimeout(() => {
  this.globeGroup.remove(marker);
  this.isFocusing = false;
}, 2000);
