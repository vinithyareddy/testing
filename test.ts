ngAfterViewInit() {
  // ✅ Step 1: Initialize globe first (draw base only)
  this.initializeGlobe();

  // ✅ Step 2: Setup resize observer
  this.setupResizeObserver();

  // ✅ Step 3: Load static JSON layers (states + oceans)
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

  // ✅ Step 4: Subscribe to filters → fetch API data
  this.fiterDataFromUrl$
    .pipe(
      distinctUntilChanged((a, b) => _.isEqual(a, b)),
      debounceTime(100),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(() => {
      this.apiService.getWidgetData(this.widgetId).subscribe(async (response: any) => {
        console.log("API Response for SKI_2 =>", response);

        // Load local JSON for metadata
        const [countryJson, stateJson] = await Promise.all([
          this.http.get<any>('assets/json/world-globe-data.json').toPromise(),
          this.http.get<any>('assets/json/state-codes.json').toPromise()
        ]);

        // Build maps
        const countryMap: Record<string, any> = {};
        countryJson.countries.forEach((c: any) => {
          countryMap[c.name.toLowerCase()] = c;
        });

        const stateMap: Record<string, any> = {};
        stateJson.states.forEach((s: any) => {
          stateMap[s.name.toLowerCase()] = s;
        });

        // ✅ Step 5: Merge API + JSON
        this.countriesList = response.map((r: any) => {
          const meta = countryMap[r.duty_country_descr?.toLowerCase()] || {};
          const stateMeta = stateMap[r.state_name?.toLowerCase()] || {};
          return {
            country: r.duty_country_descr,
            code: meta.code || 'UN',
            region: meta.region || 'Unknown',
            uniqueSkills: r.unique_skill_cnt || 0,
            skillSupply: r.skill_supply_fte || 0,
            lat: meta.lat || 0,
            lng: meta.lng || 0,
            stateCode: stateMeta.state_code || null
          };
        });

        this.filteredList = [...this.countriesList];

        // ✅ Step 6: Build color scale (original rich shades)
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

        // ✅ Step 7: Re-draw layers
        this.initializeCountryLabels();
        this.drawCountries();
        this.drawOceans();
        this.drawEquator();
        this.startRotation();

        console.log('Countries with flags:', this.countriesList);
      });
    });
}
