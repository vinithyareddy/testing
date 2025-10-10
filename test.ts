ngAfterViewInit() {
  // ✅ Step 1: Initialize base globe
  this.initializeGlobe();

  // ✅ Step 2: Setup resize listener
  this.setupResizeObserver();

  // ✅ Step 3: Subscribe to filters and get API data
  this.fiterDataFromUrl$
    .pipe(
      distinctUntilChanged((a, b) => _.isEqual(a, b)),
      debounceTime(100),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(() => {
      this.apiService.getWidgetData(this.widgetId).subscribe(async (response: any) => {
        console.log("API Response for SKI_2 =>", response);

        const countryJson = await this.http.get<any>('assets/json/world-globe-data.json').toPromise();
        const countryMap: Record<string, any> = {};
        countryJson.countries.forEach((c: any) => {
          countryMap[c.name.toLowerCase()] = c;
        });

        // Map API → structure
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

        // ✅ Step 4: Use API data only
        this.countriesList = apiCountries;
        this.filteredList = [...this.countriesList];

        // ✅ Step 5: Build color scale (original gradient)
        let minSkills = d3.min(this.countriesList, (d: any) => d.uniqueSkills) || 0;
        let maxSkills = d3.max(this.countriesList, (d: any) => d.uniqueSkills) || 1;
        if (maxSkills - minSkills < 20) {
          minSkills = 0;
          maxSkills = maxSkills * 2;
        }

        this.countryColorScale = d3.scaleLinear<string>()
          .domain([
            minSkills,
            (minSkills + maxSkills) * 0.25,
            (minSkills + maxSkills) * 0.5,
            (minSkills + maxSkills) * 0.75,
            maxSkills
          ])
          .range([
            '#f5f0e4',
            '#dbd5c8ff',
            '#bed8ceff',
            '#99c5b4ff',
            '#87c3ab'
          ]);

        // ✅ Step 6: Draw globe layers (once)
        this.initializeCountryLabels();
        this.drawOceans();
        this.drawEquator();
        this.drawCountries();
        this.startRotation();
      });
    });

  // ✅ Step 7: Load only static JSON layers (states + oceans) — skip country redraw
  this.http.get<any>('assets/json/globe-states.json').subscribe(data => {
    this.states = topojson.feature(
      data,
      data.objects.ne_50m_admin_1_states_provinces
    ) as unknown as FeatureCollection<Geometry, any>;
    this.initializeStateLabels();
    this.drawStates();
  });

  this.http.get<any>('assets/json/oceans.json').subscribe(data => {
    this.oceans = data;
    this.drawOceans();
  });
}



.subscribe(() => {
  this.apiService.getWidgetData(this.widgetId).subscribe(async (response: any) => {
    console.log("API Response for SKI_2 =>", response);

    // Load base country metadata
    const countryJson = await this.http.get<any>('assets/json/world-globe-data.json').toPromise();
    const countryMap: Record<string, any> = {};
    countryJson.countries.forEach((c: any) => {
      countryMap[c.name.toLowerCase()] = c;
    });

    // Map API response
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

    this.countriesList = apiCountries.length ? apiCountries : this.countriesList;
    this.filteredList = [...this.countriesList];

    // Rebuild color scale
    let minSkills = d3.min(this.countriesList, (d: any) => d.uniqueSkills) || 0;
    let maxSkills = d3.max(this.countriesList, (d: any) => d.uniqueSkills) || 1;
    if (maxSkills - minSkills < 20) {
      minSkills = 0;
      maxSkills = maxSkills * 2;
    }

    // ✅ IMPORTANT: Update the color scale with new data
    this.countryColorScale = d3.scaleLinear<string>()
      .domain([minSkills, (minSkills + maxSkills) * 0.25, (minSkills + maxSkills) * 0.5, (minSkills + maxSkills) * 0.75, maxSkills])
      .range([
        '#f5f0e4',
        '#dbd5c8ff',
        '#bed8ceff',
        '#99c5b4ff',
        '#87c3ab'
      ]);

    // ✅ Draw in correct order: equator first, then countries, then oceans (labels only)
    this.initializeCountryLabels();
    this.drawEquator();
    this.drawCountries(); // Countries with colors
    this.drawOceans(); // Just ocean labels, not filled shapes
    this.startRotation();
  });
});
