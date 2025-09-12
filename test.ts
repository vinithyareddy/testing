if (this.labelGroup) {
  this.labelGroup.children.forEach(obj => {
    obj.lookAt(this.camera.position);

    // ✅ Hide if on back side of globe
    const camDir = this.camera.position.clone().normalize();
    const labelDir = obj.position.clone().normalize();
    const dot = camDir.dot(labelDir);

    (obj as THREE.Sprite).visible = dot > 0; // only show if facing camera
  });
}
