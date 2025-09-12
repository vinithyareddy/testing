// Build labels aligned with tooltip positions
const labelData = this.countriesList
  .filter(c => c.lat && c.lng)
  .map(c => ({
    lat: c.lat,
    lng: c.lng,
    text: c.code,
    position: this.latLngToVector3(c.lat, c.lng, RADIUS)
  }));

// Add permanent codes on globe
this.globe
  .labelsData(labelData)
  .labelText((d: any) => d.text)
  .labelLat((d: any) => d.lat)
  .labelLng((d: any) => d.lng)
  .labelAltitude(0.02)   // lift above surface
  .labelSize(1.2)
  .labelDotRadius(0.3)
  .labelColor(() => 'black')
  .labelResolution(2);
