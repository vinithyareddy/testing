// Region mapping function (simplified: classify by continent codes)
const getRegion = (countryName: string): string => {
  const southAmerica = ['Brazil','Argentina','Colombia','Chile','Peru','Ecuador','Venezuela','Bolivia','Uruguay','Paraguay','Guyana','Suriname','French Guiana'];
  const northAmerica = ['United States of America','Canada','Mexico','Guatemala','Honduras','Belize','Costa Rica','Panama','Nicaragua','Cuba','Haiti','Dominican Republic','Jamaica','Bahamas'];

  if (southAmerica.includes(countryName)) return 'South America';
  if (northAmerica.includes(countryName)) return 'North America';
  return 'Other';
};

// Coloring logic
globe
  .polygonsData(countries.features)
  .polygonCapColor((d: any) => {
    const region = getRegion(d.properties.name);
    return REGION_COLORS[region] || REGION_COLORS['default'];
  })
  .polygonSideColor(() => 'rgba(0,0,0,0.2)')
  .polygonStrokeColor(() => '#111');
