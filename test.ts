for (const c of this.laborData) {
  if (!c.position) continue;

  // clone original position and apply globe rotation transform
  const rotatedPos = c.position.clone().applyMatrix4(this.globe.matrixWorld);

  const dist = point.distanceTo(rotatedPos);
  if (dist < minDist) {
    minDist = dist;
    closest = { ...c, position: rotatedPos }; // use rotated position
  }
}


if (closest && closest.position) {
  const vector = closest.position.clone().project(camera);
  const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
  const y = (-vector.y * 0.5 + 0.5) * renderer.domElement.clientHeight;

  tooltip.innerHTML = `<b>${closest.country}</b><br>Region: ${closest.region}<br>Avg Cost: $${closest.cost}`;
  tooltip.style.left = `${x + 15}px`;
  tooltip.style.top = `${y + 15}px`;
  tooltip.style.display = 'block';
  return;
}
