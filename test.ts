private loadData() {
  this.apiService.getWidgetData(this.widgetId).subscribe({
    next: (response: any[]) => {
      console.log("API Response (SKI_2) => ", response);

      // Use your existing country JSON
      this.http.get<any[]>('assets/json/country-codes.json').subscribe((countryMap) => {
        this.countriesList = response.map((r) => {
          const match = countryMap.find(
            (c) => c.country.toLowerCase() === r.duty_country_descr.toLowerCase()
          );

          return {
            country: r.duty_country_descr,
            code: match ? match.code : 'xx',
            region: match ? match.region : 'Unknown',
            uniqueSkills: r.unique_skill_cnt || 0,
            skillSupply: r.skill_supply_fte || 0,
            lat: match ? match.lat : 0,
            lng: match ? match.lng : 0
          };
        });

        // Define color scale
        const minSkills = d3.min(this.countriesList, (d) => d.uniqueSkills) || 0;
        const maxSkills = d3.max(this.countriesList, (d) => d.uniqueSkills) || 1;
        this.countryColorScale = d3
          .scaleLinear<string>()
          .domain([minSkills, maxSkills])
          .range(['#d9ead3', '#38761d']);

        this.filteredList = [...this.countriesList];

        // Render as before
        this.initializeCountryLabels();
        this.drawCountries();
        this.drawOceans();
        this.drawEquator();
        this.startRotation();
      });
    },
    error: (err) => console.error("Error loading SKI_2 data:", err)
  });
}
