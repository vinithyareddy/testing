this.globe = new Globe() as any;
(this.globe as any)
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
  .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
  .pointsData(this.laborData)
  .pointLat('lat')
  .pointLng('lon')
  .pointAltitude(() => 0.05)
  .pointColor(() => 'orange')
  .pointLabel((d: any) => `${d.country || d.region}<br/>Cost: $${d.avgCost}`);
