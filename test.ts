ngAfterViewInit() {
    this.fiterDataFromUrl$
      .pipe(
        distinctUntilChanged((a, b) => _.isEqual(a, b)),
        debounceTime(100),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        const dynamicFilters: string = this.queryBuilder.buildDynamicFilter(this.widgetId);
        this.apiService.getWidgetData(this.widgetId, dynamicFilters).subscribe(async (response: any) => {
          const countryJson = await this.http.get<any>('assets/json/world-globe-data.json').toPromise();
          const countryMap: Record<string, any> = {};
          countryJson.countries.forEach((c: any) => {
            countryMap[c.name.toLowerCase()] = c;
          });
  
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
  
          this.initializeGlobe();
          this.setupResizeObserver();
          
          // Counter to track async operations
          let loadedCount = 0;
          const totalLoads = 2; // states + oceans
          
          const checkAllLoaded = () => {
            loadedCount++;
            if (loadedCount === totalLoads) {
              // All data loaded, now draw and show
              this.initializeCountryLabels();
              this.drawEquator();
              this.drawCountries();
              this.drawStates();
              this.drawOceans();
              this.startRotation();
              this.ResponseFlag = true;
            }
          };
          
          // Load states
          this.http.get<any>('assets/json/globe-states.json').subscribe(data => {
            this.states = topojson.feature(
              data,
              data.objects.ne_50m_admin_1_states_provinces
            ) as unknown as FeatureCollection<Geometry, any>;
            this.initializeStateLabels();
            checkAllLoaded();
          });
          
          // Load oceans
          this.http.get<any>('assets/json/oceans.json').subscribe(data => {
            this.oceans = data;
            checkAllLoaded();
          });
        });
      });
  }