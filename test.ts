private getCountryColor(d: any): string {
  const countryName = d.properties.name;
  const entry = this.countriesList.find(c => c.country === countryName);

  // Get projected area (small countries = smaller bounding boxes)
  const area = this.getProjectedArea(d);

  if (area < 60) {
    // Small countries: use region color + texture
    // Trick: paint with region color underneath, then overlay texture separately
    return "url(#regionTexture)";
  }

  if (entry && entry.region) {
    // Larger regions: fill by region color
    const REGION_COLORS: Record<string, string> = {
      'North America': '#a8dadc',
      'South America': '#e9c46a',
      'Europe': '#2a9d8f',
      'Africa': '#f4a261',
      'Asia': '#e76f51',
      'Oceania': '#8d99ae'
    };
    return REGION_COLORS[entry.region] || FALLBACK_COLOR;
  }

  return FALLBACK
