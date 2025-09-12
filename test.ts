// after this.countriesList = data.countries.map(...)

const labelData = this.countries.features
  .map((f: any) => {
    const name = f.properties.name as string;
    const match = this.countriesList.find(
      c => c.country.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (!match) return null;
    return {
      code: match.code,
      lat: match.lat,
      lng: match.lng,
      country: match.country
    };
  })
  .filter(Boolean);

// ✅ add labels back
if (typeof (this.globe as any).labelsData === 'function') {
  this.globe
    .labelsData(labelData)
    .labelText((d: any) => d.code)   // show country code
    .labelLat((d: any) => d.lat)
    .labelLng((d: any) => d.lng)
    .labelAltitude(0.012)
    .labelSize(0.95)
    .labelDotRadius(0.16)
    .labelColor(() => 'rgba(0,0,0,0.9)')
    .labelResolution(2);
}
