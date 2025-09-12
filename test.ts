private addCountryLabels() {
  if (this.labelGroup) this.scene.remove(this.labelGroup);
  this.labelGroup = new THREE.Group();
  this.scene.add(this.labelGroup);

  // adjust labels dynamically based on zoom
  let sourceList: CountrySkill[] = [];

  if (this.searchTerm) {
    // search mode → show all matches
    sourceList = this.filteredList;
  } else {
    if (this.currentZoom < 100) {
      // very close zoom → show all countries
      sourceList = this.countriesList;
    } else if (this.currentZoom < 150) {
      // medium zoom → top 50
      sourceList = this.countriesList
        .sort((a, b) => b.uniqueSkills - a.uniqueSkills)
        .slice(0, 50);
    } else if (this.currentZoom < 200) {
      // further zoom → top 30
      sourceList = this.countriesList
        .sort((a, b) => b.uniqueSkills - a.uniqueSkills)
        .slice(0, 30);
    } else {
      // zoomed out → top 15
      sourceList = this.countriesList
        .sort((a, b) => b.uniqueSkills - a.uniqueSkills)
        .slice(0, 15);
    }
  }

  sourceList.forEach(country => {
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
