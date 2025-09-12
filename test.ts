private addCountryLabels() {
  if (this.labelGroup) this.earth.remove(this.labelGroup);

  this.labelGroup = new THREE.Group();
  this.earth.add(this.labelGroup);

  // ✅ sort countries by size/importance (e.g., uniqueSkills or area)
  const sortedCountries = [...this.filteredList].sort((a, b) => b.uniqueSkills - a.uniqueSkills);

  // ✅ show fewer labels when zoomed out
  const maxLabels = this.currentZoom > 150 ? 50 : this.currentZoom > 100 ? 100 : 200;

  let placedLabels: THREE.Vector3[] = [];

  sortedCountries.slice(0, maxLabels).forEach(country => {
    if (country.position) {
      const label = this.createTextSprite(country.code, '#ffffff', 22);

      const labelPosition = country.position.clone().normalize();
      labelPosition.multiplyScalar(RADIUS + 0.5);

      // ✅ collision check
      let tooClose = placedLabels.some(p => p.distanceTo(labelPosition) < 5);
      if (tooClose) return; // skip overlapping label

      label.position.copy(labelPosition);

      // ✅ scale label depending on zoom level
      const scaleFactor = THREE.MathUtils.clamp(200 / this.currentZoom, 0.5, 2.5);
      label.scale.multiplyScalar(scaleFactor);

      (label as any).userData = { country };
      this.labelGroup.add(label);
      placedLabels.push(labelPosition);
    }
  });
}
