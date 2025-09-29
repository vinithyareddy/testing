private normalizeName(name: string): string {
  return (name || '').toLowerCase().replace(/[^a-z]/g, '');
}

private findCountryFeature(country: CountrySkill) {
  // Try direct match
  let feature = this.countries.features.find(
    (f: any) => this.normalizeName(f.properties.name) === this.normalizeName(country.country)
  );

  // If not found, try ISO code match if available
  if (!feature && country.code) {
    feature = this.countries.features.find(
      (f: any) =>
        this.normalizeName(f.properties.name).includes(this.normalizeName(country.code))
    );
  }

  return feature;
}


const countryFeature = this.findCountryFeature(country);
