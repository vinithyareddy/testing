ngAfterViewInit() {
  this.fiterDataFromUrl$
    .pipe(
      distinctUntilChanged((a, b) => _.isEqual(a, b)),
      debounceTime(100),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(() => {
      // ✅ Step 1: Fetch data from API
      this.apiService.getWidgetData(this.widgetId).subscribe(async (response: any) => {
        console.log("API Response for SKI_2 =>", response);

        const countryJson = await this.http.get<any>('assets/json/world-globe-data.json').toPromise();

        // Build country map lookup
        const countryMap: Record<string, any> = {};
        countryJson.countries.forEach((c: any) => {
          countryMap[c.name.toLowerCase()] = c;
        });

        // ✅ Step 2: Map API data to your structure
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

        // ✅ Step 3: Merge (prefer API countries)
        this.countriesList = apiCountries.length ? apiCountries : this.countriesList;
        this.filteredList = [...this.countriesList];

        // ✅ Step 4: Rebuild color scale
        let minSkills = d3.min(this.countriesList, (d: any) => d.uniqueSkills) || 0;
        let maxSkills = d3.max(this.countriesList, (d: any) => d.uniqueSkills) || 1;
        if (maxSkills - minSkills < 5) {
          minSkills = 0;
          maxSkills = Math.max(10, maxSkills * 2);
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

        // ✅ Step 5: Update countries (keep everything else intact)
        this.updateCountries();
      });
    });

  // ✅ Step 6: KEEP this line so labels, states, oceans, etc. still appear
  this.loadData();

  // ✅ Keep these as before
  this.setupResizeObserver();
  this.initializeGlobe();
}
