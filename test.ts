(this.globe as any)
  .pointLat('lat')
  .pointLng('lon')
  .pointAltitude(() => 0.05)
  .pointColor(() => 'orange')
  .pointLabel((d: any) => `${d.country || d.region}<br/>Cost: $${d.avgCost}`);
