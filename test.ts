const handleHover = (event: MouseEvent) => {
  const mouse = new THREE.Vector2(
    (event.offsetX / renderer.domElement.clientWidth) * 2 - 1,
    -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(this.earth);
  if (intersects.length > 0) {
    const point = intersects[0].point;

    let closest: CountryCost | null = null;
    let minDist = Infinity;
    for (const c of this.laborData) {
      if (!c.dot) continue;

      const worldPos = new THREE.Vector3();
      c.dot.getWorldPosition(worldPos);
      const dist = point.distanceTo(worldPos);

      if (dist < minDist) {
        minDist = dist;
        closest = c;
      }
    }

    // 🔑 Only show tooltip if we are really close
    if (closest && minDist < 5) {
      const worldPos = new THREE.Vector3();
      closest.dot!.getWorldPosition(worldPos);

      const vector = worldPos.clone().project(camera);
      const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
      const y = (-vector.y * 0.5 + 0.5) * renderer.domElement.clientHeight;

      tooltip.innerHTML = `<b>${closest.country}</b><br>Region: ${closest.region}<br>Avg Cost: $${closest.cost}`;
      tooltip.style.left = `${x + 15}px`;
      tooltip.style.top = `${y + 15}px`;
      tooltip.style.display = 'block';
      return;
    }
  }
  tooltip.style.display = 'none';
};
