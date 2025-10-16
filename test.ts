private loadStates() {
    this.http.get<any>('assets/json/globe-states.json').subscribe(data => {
      this.states = topojson.feature(data, data.objects.ne_50m_admin_1_states_provinces) as any;
  
      // 🧹 Filter out non-polygon geometries (label points cause overlap)
      this.states.features = this.states.features.filter(
        (f: any) => f.geometry && f.geometry.type === 'Polygon'
      );
  
      // 🧹 Optionally remove extremely tiny shapes (e.g., lakes or tiny islands)
      this.states.features = this.states.features.filter((f: any) => {
        const bounds = d3.geoBounds(f);
        const area = Math.abs(bounds[1][0] - bounds[0][0]) * Math.abs(bounds[1][1] - bounds[0][1]);
        return area > 0.01;
      });
  
      this.drawStates();
    });
  }

  
  if (!this.isPointVisible(d3.geoCentroid(f))) return;


    // Filter small states dynamically (hide when zoomed out)
    const bounds = this.path.bounds(s);
    const area = (bounds[1][0] - bounds[0][0]) * (bounds[1][1] - bounds[0][1]);
    if (area < 5 / (this.currentZoom * this.currentZoom)) return false;

    
    this.updateStateBorders(); // ensure border projection first
this.updateCountryLabels();
this.updateStateLabels();

// bring labels on top
this.svg.selectAll('.country-label').raise();
this.svg.selectAll('.state-label').raise();
