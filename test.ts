private addCountryLabels() {
  if (this.labelGroup) this.earth.remove(this.labelGroup);

  this.labelGroup = new THREE.Group();
  this.earth.add(this.labelGroup);

  this.filteredList.forEach(country => {
    if (!country.position) return;

    const label = this.createTextSprite(country.code, '#ffffff', 22);

    const labelPosition = country.position.clone().normalize();
    labelPosition.multiplyScalar(RADIUS + 0.5);
    label.position.copy(labelPosition);

    // ✅ Scale labels smoothly with zoom
    const scaleFactor = THREE.MathUtils.clamp(220 / this.currentZoom, 0.4, 2.5);
    label.scale.multiplyScalar(scaleFactor);

    // ✅ Fade out tiny/crowded countries when zoomed out
    if (this.currentZoom > 200 && country.region === "Caribbean") {
      (label.material as THREE.SpriteMaterial).opacity = 0.3;
    } else {
      (label.material as THREE.SpriteMaterial).opacity = 1.0;
    }

    (label as any).userData = { country };
    this.labelGroup.add(label);
  });
}
