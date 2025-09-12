private updateLabelVisibility() {
  if (!this.labelGroup || !this.camera) return;

  const cameraPosition = this.camera.position.clone().normalize();
  const minDistance = 8; // prevent overlap

  this.labelGroup.children.forEach((label, i) => {
    const sprite = label as THREE.Sprite;
    const labelDirection = label.position.clone().normalize();

    // dot between camera and label (1 = directly facing, -1 = opposite side)
    const dot = labelDirection.dot(cameraPosition);

    // only hide if on the complete back of globe
    sprite.visible = dot > 0;

    if (sprite.visible) {
      // fade labels smoothly based on angle
      const opacity = Math.max(0.3, Math.min(1.0, dot));
      (sprite.material as THREE.SpriteMaterial).opacity = opacity;

      // hide if overlapping too close
      for (let j = 0; j < i; j++) {
        const other = this.labelGroup.children[j] as THREE.Sprite;
        if (other.visible && label.position.distanceTo(other.position) < minDistance) {
          sprite.visible = false;
          break;
        }
      }
    }
  });
}
