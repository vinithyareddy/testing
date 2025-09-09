globe
  .labelsData(this.laborData)
  .labelLat('lat')
  .labelLng('lng')
  .labelText((d: any) => `${d.region}: $${d.cost}`)  // use labelText as tooltip
  .labelSize(1.5)
  .labelDotRadius(0.8)
  .labelColor(() => 'orange')
  .labelResolution(2);
