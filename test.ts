// Build labels from JSON data (same source as tooltips)
const labelData = this.countriesList
  .filter(c => typeof c.lat === 'number' && typeof c.lng === 'number')
  .map(c => ({
    lat: c.lat,
    lng: c.lng,
    text: c.code   // 2-letter code
  }));

this.globe
  .labelsData(labelData)
  .labelText((d: any) => d.text)
  .labelLat((d: any) => d.lat)
  .labelLng((d: any) => d.lng)
  .labelAltitude(0.015)    // slightly above surface
  .labelSize(1.2)
  .labelDotRadius(0.2)
  .labelColor(() => 'black')
  .labelResolution(2);
