// --- Centroid labels (always aligned) ---
const centroidLabelData = this.countries.features
  .map((f: any) => {
    const [lng, lat] = geoCentroid(f);
    const name = f.properties.name;
    const match = this.countriesList.find(
      c => c.country.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (!match) return null;
    return { code: match.code, lat, lng, country: name };
  })
  .filter(Boolean);

// --- JSON capital labels (may drift) ---
const capitalLabelData = this.countriesList.map(c => ({
  code: c.code,
  lat: c.lat,
  lng: c.lng,
  country: c.country
}));

// --- Add centroid labels (black) ---
if (typeof (this.globe as any).labelsData === 'function') {
  this.globe
    .labelsData(centroidLabelData)
    .labelText((d: any) => d.code)
    .labelLat((d: any) => d.lat)
    .labelLng((d: any) => d.lng)
    .labelAltitude(0.012)
    .labelSize(0.95)
    .labelDotRadius(0.16)
    .labelColor(() => 'rgba(0,0,0,0.9)')
    .labelResolution(2);
}

// --- Add capital labels (red) ---
const capitalGlobe = new Globe();
capitalGlobe
  .labelsData(capitalLabelData)
  .labelText((d: any) => d.code)
  .labelLat((d: any) => d.lat)
  .labelLng((d: any) => d.lng)
  .labelAltitude(0.012)
  .labelSize(0.95)
  .labelDotRadius(0.16)
  .labelColor(() => 'rgba(200,0,0,0.9)')   // 🔴 red
  .labelResolution(2);

scene.add(capitalGlobe);
