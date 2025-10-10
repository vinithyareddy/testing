ngAfterViewInit() {
  // ✅ Step 1: Subscribe to filters and fetch API data FIRST
  this.fiterDataFromUrl$
    .pipe(
      distinctUntilChanged((a, b) => _.isEqual(a, b)),
      debounceTime(100),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(() => {
      this.apiService.getWidgetData(this.widgetId).subscribe(async (response: any) => {
        console.log("🌍 API Response for SKI_2 =>", response);

        // ✅ Step 2: Load country metadata (for flags, coords, etc.)
        const countryJson = await this.http.get<any>('assets/json/world-globe-data.json').toPromise();
        const countryMap: Record<string, any> = {};
        countryJson.countries.forEach((c: any) => {
          countryMap[c.name.toLowerCase()] = c;
        });

        // ✅ Step 3: Map API data with metadata
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

        // ✅ Step 4: Build color gradient BEFORE drawing globe
        let minSkills = d3.min(this.countriesList, (d: any) => d.uniqueSkills) || 0;
        let maxSkills = d3.max(this.countriesList, (d: any) => d.uniqueSkills) || 1;
        if (maxSkills - minSkills < 20) {
          minSkills = 0;
          maxSkills = maxSkills * 2;
        }

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

        // ✅ Step 5: Now that API data is ready, initialize the globe
        this.initializeGlobe();
        this.setupResizeObserver();

        // ✅ Step 6: Load states & oceans (draw after globe is ready)
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

        // ✅ Step 7: Draw everything else
        this.initializeCountryLabels();
        this.drawEquator();
        this.drawCountries();
        this.startRotation();
      });
    });
}
