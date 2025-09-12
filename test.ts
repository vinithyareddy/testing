private updateLabelVisibility() {
  if (!this.labelGroup || !this.camera) return;

  const minDistance = 8; // prevent overlap

  this.labelGroup.children.forEach((label, i) => {
    const sprite = label as THREE.Sprite;

    // project label into camera space
    const vector = label.position.clone().project(this.camera);

    // hide if it's behind the globe (z > 1 means it's behind camera)
    if (vector.z > 1) {
      sprite.visible = false;
      return;
    }

    // compute opacity based on how centered it is on screen
    const dot = new THREE.Vector3(0, 0, -1).dot(vector.normalize());
    const opacity = Math.max(0.3, Math.min(1.0, 1 - Math.abs(vector.z)));
    (sprite.material as THREE.SpriteMaterial).opacity = opacity;

    sprite.visible = true;

    // prevent overlap
    for (let j = 0; j < i; j++) {
      const other = this.labelGroup.children[j] as THREE.Sprite;
      if (other.visible && label.position.distanceTo(other.position) < minDistance) {
        sprite.visible = false;
        break;
      }
    }
  });
}
