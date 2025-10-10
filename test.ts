this.apiService.getWidgetData(this.widgetId).subscribe(async (response: any) => {
  console.log("API Response for SKI_2 =>", response);

  // Load country + state metadata
  const [countryJson, stateJson] = await Promise.all([
    this.http.get<any>('assets/json/world-globe-data.json').toPromise(),
    this.http.get<any>('assets/json/globe-states.json').toPromise()
  ]);

  const countryMap: Record<string, any> = {};
  countryJson.countries.forEach((c: any) => {
    countryMap[c.name.toLowerCase()] = c;
  });

  // Map API data to your countriesList
  this.countriesList = response.map((r: any) => {
    const meta = countryMap[r.duty_country_descr?.toLowerCase()] || {};
    return {
      country: r.duty_country_descr,
      code: meta.code || 'UN',
      region: meta.region || 'Unknown',
      uniqueSkills: r.unique_skill_cnt || 0,
      skillSupply: r.skill_supply_fte || 0,
      lat: meta.lat || 0,
      lng: meta.lng || 0
    };
  });

  this.filteredList = [...this.countriesList];

  // Now redraw visualization
  this.initializeCountryLabels();
  this.drawCountries();
  this.drawOceans();
  this.drawEquator();
  this.startRotation();
});
