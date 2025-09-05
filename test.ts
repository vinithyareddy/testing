this.globe = new Globe() as any;
(this.globe as any)
  .globeMaterial(new THREE.MeshPhongMaterial({ color: 0x4da6ff })) // 🌍 light blue
  .pointsData(this.laborData)
  .pointLat('lat')
  .pointLng('lon')
  .pointAltitude(() => 0.05)
  .pointColor(() => 'darkblue') // marker color, you can pick red/orange if you like
  .pointLabel((d: any) => `${d.country || d.region}<br/>Cost: $${d.avgCost}`);
this.scene.add(this.globe);
