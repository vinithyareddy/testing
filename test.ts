const labelData = this.countriesList.map(c => ({
  code: c.code,
  lat: c.lat,
  lng: c.lng,
  country: c.country
}));

if (typeof (this.globe as any).labelsData === 'function') {
  this.globe
    .labelsData(labelData)
    .labelText((d: any) => d.code)   // show ISO code
    .labelLat((d: any) => d.lat)
    .labelLng((d: any) => d.lng)
    .labelAltitude(0.012)
    .labelSize(0.95)
    .labelDotRadius(0.16)
    .labelColor(() => 'rgba(0,0,0,0.9)')
    .labelResolution(2);
}
