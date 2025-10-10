this.setupResizeObserver();
this.initializeGlobe();

// ✅ Load only boundaries and oceans, no dummy country data
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
