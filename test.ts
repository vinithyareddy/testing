private updateLabelVisibility() {
  if (!this.labelGroup || !this.camera) return;

  this.labelGroup.children.forEach(label => {
    const sprite = label as THREE.Sprite;
    (sprite.material as THREE.SpriteMaterial).opacity = 1; // always fully visible
    sprite.visible = true; // never hide
  });
}
