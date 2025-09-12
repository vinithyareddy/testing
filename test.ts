private addCountryLabels() {
  if (this.labelGroup) this.earth.remove(this.labelGroup);

  this.labelGroup = new THREE.Group();
  this.earth.add(this.labelGroup);

  const placedLabels: THREE.Vector3[] = [];

  this.filteredList.forEach(country => {
    if (!country.position) return;

    // ✅ Decide visibility by zoom + country size
    const isBigCountry = ['US','MX','BR','CA','CO','VE','AR','CL'].includes(country.code);
    if (!isBigCountry && this.currentZoom > 150) {
      return; // skip small countries when zoomed out
    }

    const label = this.createTextSprite(country.code, '#ffffff', 22);

    const labelPosition = country.position.clone().normalize();
    labelPosition.multiplyScalar(RADIUS + 0.5);

    // ✅ Collision check (skip if too close to another label)
    const tooClose = placedLabels.some(p => p.distanceTo(labelPosition) < 8);
    if (tooClose) return;

    label.position.copy(labelPosition);

    // ✅ Scale with zoom
    const scaleFactor = THREE.MathUtils.clamp(200 / this.currentZoom, 0.4, 2.5);
    label.scale.multiplyScalar(scaleFactor);

    (label as any).userData = { country };
    this.labelGroup.add(label);
    placedLabels.push(labelPosition);
  });
}
