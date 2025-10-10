// 1. ADD THIS INTERFACE at the top after imports
interface ApiSkillLocationResponse {
  fiscal_year: string;
  duty_country_descr: string;
  unique_skill_cnt: number;
  skill_supply_fte: number;
}

// 2. ADD THIS PROPERTY to store the country mapping from JSON
private countryMappingFromJson: Map<string, { code: string, lat: number, lng: number }> = new Map();

// 3. REPLACE YOUR ngAfterViewInit() METHOD with this:
ngAfterViewInit() {
  // First load the country mapping from your existing JSON
  this.http.get<any>('assets/json/world-globe-data.json').subscribe(data => {
    // Build mapping from JSON
    data.countries.forEach((c: any) => {
      this.countryMappingFromJson.set(c.name.toLowerCase().trim(), {
        code: c.code,
        lat: c.lat,
        lng: c.lng
      });
    });
    
    console.log("Country mapping loaded:", this.countryMappingFromJson.size, "countries");
    
    // Now subscribe to API data changes
    this.fiterDataFromUrl$.pipe(
      distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
      debounceTime(100),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((filterStr: string) => {
      console.log("Filter changed:", filterStr);
      this.loadApiData();
    });
  });

  this.setupResizeObserver();
  this.initializeGlobe();
  this.loadStaticGeoData();
}

// 4. ADD THIS NEW METHOD to load API data
private loadApiData() {
  this.apiService.getWidgetData(this.widgetId).subscribe({
    next: (response: ApiSkillLocationResponse[]) => {
      console.log("API Response for", this.widgetId, "=>", response);
      
      if (!response || response.length === 0) {
        console.warn("No data returned from API");
        this.countriesList = [];
        this.filteredList = [];
        return;
      }

      // Group by country and sum the values
      const countryMap = new Map<string, { uniqueSkills: number, skillSupply: number }>();

      response.forEach(item => {
        const country = item.duty_country_descr;
        if (!country) return;

        if (!countryMap.has(country)) {
          countryMap.set(country, { uniqueSkills: 0, skillSupply: 0 });
        }

        const existing = countryMap.get(country)!;
        existing.uniqueSkills += item.unique_skill_cnt || 0;
        existing.skillSupply += item.skill_supply_fte || 0;
      });

      // Convert to CountrySkill array using your JSON mapping
      this.countriesList = Array.from(countryMap.entries())
        .map(([countryName, data]) => {
          const normalized = countryName.toLowerCase().trim();
          const info = this.countryMappingFromJson.get(normalized);
          
          if (!info) {
            console.warn(`No mapping found for: ${countryName}`);
            return null;
          }

          return {
            country: countryName,
            code: info.code,
            uniqueSkills: data.uniqueSkills,
            skillSupply: data.skillSupply,
            lat: info.lat,
            lng: info.lng,
            region: undefined
          };
        })
        .filter((c): c is CountrySkill => c !== null);

      console.log("Processed countries:", this.countriesList);

      // Update color scale based on API data
      const minSkills = d3.min(this.countriesList, d => d.uniqueSkills) || 0;
      const maxSkills = d3.max(this.countriesList, d => d.uniqueSkills) || 1;
      
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
      
      // Redraw with new data
      this.initializeCountryLabels();
      this.updateCountries();
    },
    error: (error) => {
      console.error("Error fetching widget data:", error);
      this.countriesList = [];
      this.filteredList = [];
    }
  });
}

// 5. REPLACE YOUR loadData() METHOD with this simpler version:
private loadStaticGeoData() {
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

  // Initialize globe elements
  this.initializeCountryLabels();
  this.drawCountries();
  this.drawEquator();
  this.startRotation();
}

// 6. ADD this method for handling missing flags
handleFlagError(event: any) {
  event.target.src = 'assets/images/flags/default.svg';
}