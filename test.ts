// --- Tooltip logic (raycasting, accurate) ---
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
    const feature = intersect.object.userData?.polygon || intersect.object.userData?.feature;

    if (feature) {
      const entry = this.laborData.find(c => c.country === feature.properties.name);
      if (entry) {
        const vector = intersect.point.clone().project(camera);
        const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
        const y = (-vector.y * 0.5 + 0.5) * renderer.domElement.clientHeight;

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
