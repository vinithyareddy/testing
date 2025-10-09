ngAfterViewInit() {
  this.fiterDataFromUrl$.pipe(
    distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
    debounceTime(100),
    takeUntilDestroyed(this.destroyRef)
  ).subscribe((x: string) => {
    console.log("filters", x);
    
    // Call API and handle response
    this.apiService.getWidgetData(this.widgetId).subscribe((response) => {
      console.log("API Response => ", response);
      
      // Check if response has data
      if (response && response.data && response.data.length > 0) {
        this.processLocationData(response.data);
      } else {
        console.warn("No data received from API");
        // Fallback to static data if API fails
        this.loadData();
      }
    }, (error) => {
      console.error("API Error:", error);
      // Fallback to static data if API fails
      this.loadData();
    });
  });

  this.setupResizeObserver();
  this.initializeGlobe();
  // Note: loadData() is now called only if API fails
}

private processLocationData(apiData: any[]): void {
  console.log("Processing location data from API:", apiData);
  
  // Load your existing world-globe-data.json which has coordinates and codes
  this.http.get<any>('assets/json/world-globe-data.json').subscribe(staticData => {
    console.log("Static country data loaded:", staticData);
    
    // Create a map for quick lookup - key is country name (lowercase for matching)
    const apiDataMap = new Map();
    apiData.forEach(item => {
      const countryName = (item.duty_country_descr || item.country || '').trim();
      if (countryName) {
        apiDataMap.set(countryName.toLowerCase(), {
          uniqueSkills: item.unique_skill_cnt || 0,
          skillSupply: item.skill_supply_fte || 0
        });
      }
    });
    
    console.log("API data map created, size:", apiDataMap.size);
    
    // Merge API data with static data
    this.countriesList = staticData.countries.map((c: any) => {
      const countryNameLower = c.name.toLowerCase();
      const apiInfo = apiDataMap.get(countryNameLower);
      
      return {
        country: c.name,
        code: c.code,
        region: c.region,
        uniqueSkills: apiInfo ? apiInfo.uniqueSkills : 0,
        skillSupply: apiInfo ? apiInfo.skillSupply : 0,
        lat: c.lat,
        lng: c.lng
      };
    }).filter((c: any) => c.uniqueSkills > 0 || c.skillSupply > 0); // Only show countries with data
    
    console.log("Final countries list with API data, count:", this.countriesList.length);
    
    // If no countries have data, show warning
    if (this.countriesList.length === 0) {
      console.warn("No matching countries found between API and static data");
      // Fallback to static data
      this.loadData();
      return;
    }
    
    // Update color scale based on actual data
    const minSkills = d3.min(this.countriesList, (d: any) => d.uniqueSkills) || 0;
    const maxSkills = d3.max(this.countriesList, (d: any) => d.uniqueSkills) || 1;
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
    
    this.filteredList = [...this.countriesList];
    this.initializeCountryLabels();
    this.drawCountries();
    this.drawOceans();
    this.drawEquator();
    this.startRotation();
    
    // Load states and oceans data
    this.loadStatesAndOceans();
  }, (error) => {
    console.error("Error loading static data:", error);
    // Fallback to old method
    this.loadData();
  });
}

private loadStatesAndOceans(): void {
  // Load states data
  this.http.get<any>('assets/json/globe-states.json').subscribe(data => {
    this.states = topojson.feature(
      data,
      data.objects.ne_50m_admin_1_states_provinces
    ) as unknown as FeatureCollection<Geometry, any>;
    this.initializeStateLabels();
    this.drawStates();
  });
  
  // Load oceans data
  this.http.get<any>('assets/json/oceans.json').subscribe(data => {
    this.oceans = data;
    this.drawOceans();
  });
}