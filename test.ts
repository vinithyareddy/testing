renderer.domElement.addEventListener('mousemove', (event: MouseEvent) => {
  const rect = renderer.domElement.getBoundingClientRect();
  const mouse = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(this.globe.children, true);

  if (intersects.length > 0) {
    const intersect = intersects[0];
    if (intersect.object && intersect.object.userData && intersect.object.userData.polygon) {
      const d: any = intersect.object.userData.polygon;
      const countryName = d.properties.name;
      const entry = this.laborData.find(c => c.country === countryName);

      if (entry) {
        const [lon, lat] = geoCentroid(d); // centroid of polygon
        const pos = latLngToVector3(lat, lon, 100);
        const screenPos = pos.clone().project(camera);

        const x = (screenPos.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
        const y = (-screenPos.y * 0.5 + 0.5) * renderer.domElement.clientHeight;

        tooltip.innerHTML = `<b>${entry.country}</b><br>Region: ${entry.region}<br>Avg Cost: $${entry.cost}`;
        tooltip.style.left = `${x + 15}px`;
        tooltip.style.top = `${y + 15}px`;
        tooltip.style.display = 'block';
        return;
      }
    }
  }
  tooltip.style.display = 'none';
});
