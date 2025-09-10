this.globe.labelsData(this.countries.features)
  .labelText((d: any) => {
    // Show only larger countries at far zoom
    if (this.currentZoom > 200 && d.properties.name.length > 10) return null;  
    return d.properties.name;
  })
  .labelSize((d: any) => {
    // Scale label size with zoom
    return this.currentZoom < 120 ? 1.5 : 0.8;
  })
  .labelDotRadius(0.2)
  .labelColor(() => '#111')
  .labelResolution(2); // improves text clarity


  private updateCameraZoom() {
    if (this.controls.object) {
      this.controls.object.position.z = this.currentZoom;
      this.applyLabels(); // refresh labels with new zoom rules
    }
  }
  
  private applyLabels() {
    if (!this.countries) return;
  
    this.globe.labelsData(this.countries.features)
      .labelText((d: any) => {
        if (this.currentZoom > 200 && d.properties.name.length > 10) return null;
        return d.properties.name;
      })
      .labelSize(this.currentZoom < 120 ? 1.5 : 0.8)
      .labelDotRadius(0.2)
      .labelColor(() => '#111')
      .labelResolution(2);
  }
  