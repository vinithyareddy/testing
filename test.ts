private addCountryLabels() {
  if (this.labelGroup) this.earth.remove(this.labelGroup);

  this.labelGroup = new THREE.Group();
  this.earth.add(this.labelGroup);

  // Sort so that bigger/important countries are kept first
  const sortedCountries = [...this.filteredList].sort((a, b) => b.uniqueSkills - a.uniqueSkills);

  const placed: THREE.Vector3[] = [];

  sortedCountries.forEach(country => {
    if (!country.position) return;

    const label = this.createTextSprite(country.code, '#ffffff', 22);

    // ✅ Put label directly on globe surface
    const labelPosition = country.position.clone().normalize().multiplyScalar(RADIUS + 0.01);

    // ✅ Check overlap: if too close to another label, skip it
    const tooClose = placed.some(p => p.distanceTo(labelPosition) < 5);
    if (tooClose) return;

    label.position.copy(labelPosition);

    // ✅ Scale with zoom (smaller when zoomed out)
    const scaleFactor = THREE.MathUtils.clamp(220 / this.currentZoom, 0.5, 2.0);
    label.scale.multiplyScalar(scaleFactor);

    (label as any).userData = { country };
    this.labelGroup.add(label);
    placed.push(labelPosition);
  });
}
