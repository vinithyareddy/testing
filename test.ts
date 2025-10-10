ngAfterViewInit() {
  this.setupResizeObserver();
  this.initializeGlobe();
  this.loadData();

  this.fiterDataFromUrl$.pipe(
    distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
    debounceTime(100),
    takeUntilDestroyed(this.destroyRef)
  ).subscribe((x: string) => {
    console.log("filters", x);

    this.apiService.getWidgetData(this.widgetId).subscribe(async (response: any) => {
      console.log("API Response => ", response);

      // Load country metadata
      const countryJson = await this.http.get<any>('assets/json/world-globe-data.json').toPromise();
      const countryMap: Record<string, any> = {};
      countryJson.countries.forEach((c: any) => {
        countryMap[c.name.toLowerCase()] = c;
      });

      // Map API data
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

      // Update countries list
      this.countriesList = apiCountries.length ? apiCountries : this.countriesList;
      this.filteredList = [...this.countriesList];

      // Rebuild color scale
      let minSkills = d3.min(this.countriesList, (d: any) => d.uniqueSkills) || 0;
      let maxSkills = d3.max(this.countriesList, (d: any) => d.uniqueSkills) || 1;
      if (maxSkills - minSkills < 20) {
        minSkills = 0;
        maxSkills = maxSkills * 2;
      }

      this.countryColorScale = d3.scaleLinear<string>()
        .domain([minSkills, (minSkills + maxSkills) * 0.25, (minSkills + maxSkills) * 0.5, (minSkills + maxSkills) * 0.75, maxSkills])
        .range(['#f5f0e4', '#dbd5c8ff', '#bed8ceff', '#99c5b4ff', '#87c3ab']);

      // Just update colors, don't redraw
      this.updateCountries();
    });
  });
}