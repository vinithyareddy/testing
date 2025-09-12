private addCountryLabels() {
  if (this.labelGroup) this.earth.remove(this.labelGroup);

  this.labelGroup = new THREE.Group();
  this.earth.add(this.labelGroup);

  this.filteredList.forEach(country => {
    if (country.position) {
      const label = this.createTextSprite(country.code, '#ffffff', 22);

      const labelPosition = country.position.clone().normalize();
      labelPosition.multiplyScalar(RADIUS + 0.5);
      label.position.copy(labelPosition);

      // ✅ Scale smoothly based on zoom
      // Zoomed out → smaller labels, Zoomed in → larger
      const scaleFactor = THREE.MathUtils.clamp(250 / this.currentZoom, 0.3, 2.0);
      label.scale.multiplyScalar(scaleFactor);

      // ✅ Optional: fade very small labels when zoomed out
      if (this.currentZoom > 200 && country.region === "Caribbean") {
        (label.material as THREE.SpriteMaterial).opacity = 0.4;
      } else {
        (label.material as THREE.SpriteMaterial).opacity = 1.0;
      }

      (label as any).userData = { country };
      this.labelGroup.add(label);
    }
  });
}
