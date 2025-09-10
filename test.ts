// ✅ Add country labels with decluttering
this.globe
  .labelsData(this.countries.features)
  .labelLat((d: any) => d3.geoCentroid(d)[1])  // center of polygon
  .labelLng((d: any) => d3.geoCentroid(d)[0])  // center of polygon
  .labelText((d: any) => d.properties.name)    // country name
  .labelSize(0.8)                              // font size
  .labelDotRadius(0.4)                         // small anchor dot
  .labelColor(() => '#000000')                 // black text
  .labelResolution(5);                         // 🔑 declutter overlapping labels
