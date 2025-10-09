ngAfterViewInit() {
  this.fiterDataFromUrl$.pipe(
    distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
    debounceTime(100),
    takeUntilDestroyed(this.destroyRef)
  ).subscribe((x: string) => {
    console.log("filters", x);
    
    // Call API
    this.apiService.getWidgetData(this.widgetId).subscribe((response: any) => {
      console.log("=== API Response ===", response);
      
      // Get the array from response
      let apiData: any[] = [];
      if (Array.isArray(response)) {
        apiData = response;
      } else if (response && response.data) {
        apiData = response.data;
      }
      
      console.log("=== API Data Array ===", apiData);
      
      if (apiData && apiData.length > 0) {
        this.loadCountryCodesAndProcess(apiData);
      } else {
        console.warn("No API data, loading static data");
        this.loadData();
      }
    }, (error: any) => {
      console.error("API Error:", error);
      this.loadData();
    });
  });

  this.setupResizeObserver();
  this.initializeGlobe();
}

private loadCountryCodesAndProcess(apiData: any[]): void {
  console.log("=== Step 1: Loading JSON for country codes ===");
  
  // Load your JSON to get country codes
  this.http.get<any>('assets/json/world-globe-data.json').subscribe(jsonData => {
    console.log("=== Step 2: JSON loaded ===", jsonData);
    
    // Create a simple map: Country Name -> Country Code
    const nameToCodeMap = new Map<string, any>();
    jsonData.countries.forEach((country: any) => {
      const lowerName = country.name.toLowerCase().trim();
      nameToCodeMap.set(lowerName, {
        code: country.code,
        lat: country.lat,
        lng: country.lng,
        region: country.region
      });
    });
    
    console.log("=== Step 3: Name to Code map created, size:", nameToCodeMap.size);
    
    // Now process API data
    this.countriesList = [];
    
    apiData.forEach((item: any) => {
      const countryName = item.duty_country_descr || '';
      const uniqueSkills = item.unique_skill_cnt || 0;
      const skillSupply = item.skill_supply_fte || 0;
      
      console.log(`Processing: ${countryName} - Skills: ${uniqueSkills}, Supply: ${skillSupply}`);
      
      // Find matching country in JSON
      const countryInfo = nameToCodeMap.get(countryName.toLowerCase().trim());
      
      if (countryInfo) {
        console.log(`✓ Matched: ${countryName} -> Code: ${countryInfo.code}`);
        
        this.countriesList.push({
          country: countryName,
          code: countryInfo.code,
          region: countryInfo.region,
          uniqueSkills: uniqueSkills,
          skillSupply: skillSupply,
          lat: countryInfo.lat,
          lng: countryInfo.lng
        });
      } else {
        console.warn(`✗ NOT MATCHED: ${countryName} - not found in JSON`);
      }
    });
    
    console.log("=== Step 4: Final countries list ===", this.countriesList);
    console.log("=== Total matched countries:", this.countriesList.length);
    
    if (this.countriesList.length === 0) {
      console.error("NO COUNTRIES MATCHED! Loading static data as fallback");
      this.loadData();
      return;
    }
    
    // Update the display
    this.filteredList = [...this.countriesList];
    
    // Draw everything
    this.initializeCountryLabels();
    this.drawCountries();
    this.drawOceans();
    this.drawEquator();
    this.startRotation();
    this.loadStatesAndOceans();
    
    console.log("=== DONE! Countries displayed ===");
  });
}

private loadStatesAndOceans(): void {
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