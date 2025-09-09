const getRegion = (countryName: string): string => {
  // Full North America region (incl. Central America + Caribbean)
  const northAmerica = [
    'United States of America', 'Canada', 'Mexico',
    'Guatemala', 'Belize', 'Honduras', 'El Salvador',
    'Nicaragua', 'Costa Rica', 'Panama',
    'Cuba', 'Haiti', 'Dominican Republic', 'Jamaica',
    'Bahamas', 'Trinidad and Tobago', 'Barbados',
    'Saint Lucia', 'Grenada', 'Saint Vincent and the Grenadines',
    'Antigua and Barbuda', 'Dominica', 'Saint Kitts and Nevis'
  ];

  // Full South America region
  const southAmerica = [
    'Brazil', 'Argentina', 'Colombia', 'Chile', 'Peru',
    'Ecuador', 'Venezuela', 'Bolivia', 'Uruguay', 'Paraguay',
    'Guyana', 'Suriname', 'French Guiana'
  ];

  if (northAmerica.includes(countryName)) return 'North America';
  if (southAmerica.includes(countryName)) return 'South America';
  return 'Other';
};
