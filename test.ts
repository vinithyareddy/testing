const handleHover = (event: MouseEvent) => {
  const mouse = new THREE.Vector2(
    (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1,
    -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, this.camera);

  // ✅ Intersect with the globe sphere mesh
  const intersects = raycaster.intersectObject(this.globe);
  if (intersects.length > 0) {
    const point = intersects[0].point;

    let closest: CountryCost | null = null;
    let minDist = Infinity;
    for (const c of this.laborData) {
      if (!c.position) continue;

      // Country center projected onto globe surface
      const rotatedPos = c.position.clone().applyMatrix4(this.globe.matrixWorld);

      const dist = point.distanceTo(rotatedPos);
      if (dist < minDist) {
        minDist = dist;
        closest = c;
      }
    }

    if (closest) {
      const vector = this.latLngToVector3(closest.lat, closest.lng, RADIUS)
        .applyMatrix4(this.globe.matrixWorld)
        .project(this.camera);

      const x = (vector.x * 0.5 + 0.5) * this.renderer.domElement.clientWidth;
      const y = (-vector.y * 0.5 + 0.5) * this.renderer.domElement.clientHeight;

      tooltip.innerHTML = `<b>${closest.country}</b><br>Region: ${closest.region}<br>Avg Cost: $${closest.cost}`;
      tooltip.style.left = `${x + 15}px`;
      tooltip.style.top = `${y + 15}px`;
      tooltip.style.display = 'block';
      return;
    }
  }

  tooltip.style.display = 'none';
};
