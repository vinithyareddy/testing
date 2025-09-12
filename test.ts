// After building this.countriesList
const labelData = this.countriesList.map(c => ({
  lat: c.lat,
  lng: c.lng,
  text: c.code // 👈 show code on the globe
}));

// Add labels to globe
this.globe
  .labelsData(labelData)
  .labelText((d: any) => d.text)
  .labelLat((d: any) => d.lat)
  .labelLng((d: any) => d.lng)
  .labelAltitude(0.02)  // height above surface
  .labelSize(1.2)       // font size
  .labelDotRadius(0.3)  // small dot under the code
  .labelColor(() => 'black') // text color
  .labelResolution(2);
