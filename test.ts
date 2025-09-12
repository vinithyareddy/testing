const labelData = this.countries.features
  .map((f: any) => {
    const name = f.properties.name as string;
    const code = this.nameToCode.get(name);
    if (!code) return null;

    const fixed = this.coordsByCode.get(code);
    let lat: number, lng: number;

    if (fixed) {
      // use curated JSON coords
      ({ lat, lng } = fixed);
    } else {
      // fallback to centroid
      [lng, lat] = geoCentroid(f) as [number, number];
    }

    return { code, lat, lng, country: name };
  })
  .filter(Boolean);

if (typeof (this.globe as any).labelsData === 'function') {
  this.globe
    .labelsData(labelData)
    .labelText((d: any) => d.code)
    .labelLat((d: any) => d.lat)
    .labelLng((d: any) => d.lng)
    .labelAltitude(0.012)
    .labelSize(0.95)
    .labelDotRadius(0.16)
    .labelColor(() => 'rgba(0,0,0,0.9)')
    .labelResolution(2);
}
