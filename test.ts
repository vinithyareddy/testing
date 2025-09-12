private lastZoom: number = this.currentZoom;


private addCountryLabels() {
  if (this.labelGroup) this.scene.remove(this.labelGroup);
  this.labelGroup = new THREE.Group();
  this.scene.add(this.labelGroup);

  // dynamically adjust labels based on zoom
  let maxLabels = 15; // fallback
  if (this.currentZoom < 100) {
    maxLabels = 80; // very close zoom → show many
  } else if (this.currentZoom < 150) {
    maxLabels = 50;
  } else if (this.currentZoom < 200) {
    maxLabels = 30;
  } else {
    maxLabels = 15; // zoomed out
  }

  const sourceList = this.searchTerm ? this.filteredList : this.countriesList;

  sourceList
    .sort((a, b) => b.uniqueSkills - a.uniqueSkills)
    .slice(0, maxLabels)
    .forEach(country => {
      if (country.position) {
        const label = this.createTextSprite(country.code, '#ffffff', 28);
        const labelPosition = country.position.clone().normalize();
        labelPosition.multiplyScalar(RADIUS + 0.5);
        label.position.copy(labelPosition);
        (label as any).userData = { country };
        this.labelGroup.add(label);
      }
    });
}


const animate = () => {
  requestAnimationFrame(animate);
  this.controls.update();

  // check if zoom level changed
  const currentZ = this.camera.position.z;
  if (Math.abs(currentZ - this.lastZoom) > 5) {
    this.currentZoom = currentZ;
    this.addCountryLabels();   // refresh labels dynamically
    this.lastZoom = currentZ;
  }

  this.updateLabelVisibility();
  renderer.render(this.scene, this.camera);
};
