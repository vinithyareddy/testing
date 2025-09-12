private addCountryLabels() {
  if (this.labelGroup) this.earth.remove(this.labelGroup);

  this.labelGroup = new THREE.Group();
  this.earth.add(this.labelGroup); // rotate with earth

  this.countriesList.forEach(country => {
    if (country.position) {
      const label = this.createTextSprite(country.country, '#ffffff', 22);

      // position in world space
      const labelPosition = country.position.clone().normalize();
      labelPosition.multiplyScalar(RADIUS + 0.5);

      // convert to local earth space
      this.earth.worldToLocal(labelPosition);

      label.position.copy(labelPosition);
      (label as any).userData = { country };

      this.labelGroup.add(label);
    }
  });
}
