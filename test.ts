private addCountryLabels() {
  if (this.labelGroup) this.earth.remove(this.labelGroup);

  this.labelGroup = new THREE.Group();
  this.earth.add(this.labelGroup);

  const placed: THREE.Vector3[] = [];

  this.filteredList.forEach(country => {
    if (!country.position) return;

    const label = this.createTextSprite(country.code, '#ffffff', 22);

    let labelPosition = country.position.clone().normalize();
    labelPosition.multiplyScalar(RADIUS + 0.5);

    // ✅ Spread labels apart if too close
    placed.forEach(p => {
      if (p.distanceTo(labelPosition) < 6) {
        // push outward slightly
        const dir = labelPosition.clone().sub(p).normalize();
        labelPosition.add(dir.multiplyScalar(5));
      }
    });

    label.position.copy(labelPosition);

    // ✅ Scale with zoom
    const scaleFactor = THREE.MathUtils.clamp(220 / this.currentZoom, 0.5, 2.5);
    label.scale.multiplyScalar(scaleFactor);

    (label as any).userData = { country };
    this.labelGroup.add(label);
    placed.push(labelPosition);
  });
}
