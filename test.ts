this.apiService.getWidgetData(this.widgetId).subscribe(async (response: any) => {
  console.log("API Response for SKI_2 =>", response);

  const countryJson = await this.http.get<any>('assets/json/world-globe-data.json').toPromise();

  // build lookup
  const countryMap: Record<string, any> = {};
  countryJson.countries.forEach((c: any) => {
    countryMap[c.name.toLowerCase()] = c;
  });

  // ✅ only override countriesList (keep states, oceans, labels handled by loadData)
  const apiCountries = response.map((r: any) => {
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

  // merge: prefer API data, fall back to JSON defaults
  this.countriesList = apiCountries.length ? apiCountries : this.countriesList;
  this.filteredList = [...this.countriesList];

  // recalc color scale
  let minSkills = d3.min(this.countriesList, (d: any) => d.uniqueSkills) || 0;
  let maxSkills = d3.max(this.countriesList, (d: any) => d.uniqueSkills) || 1;
  if (maxSkills - minSkills < 5) { minSkills = 0; maxSkills = Math.max(10, maxSkills * 2); }

  this.countryColorScale = d3.scaleLinear<string>()
    .domain([
      minSkills,
      minSkills + (maxSkills - minSkills) * 0.25,
      minSkills + (maxSkills - minSkills) * 0.5,
      minSkills + (maxSkills - minSkills) * 0.75,
      maxSkills
    ])
    .range([
      '#f5f0e4',
      '#dbd5c8ff',
      '#bed8ceff',
      '#99c5b4ff',
      '#87c3ab'
    ]);

  // redraw only country layer (states & oceans handled by loadData)
  this.updateCountries();
});
