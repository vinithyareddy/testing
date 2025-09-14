for (const c of this.countriesList) {
  if (!c.position) continue;

  // clone original position and apply current globe rotation
  const rotatedPos = c.position.clone().applyMatrix4(this.globeGroup.matrixWorld);

  const dist = point.distanceTo(rotatedPos);
  if (dist < minDist) {
    minDist = dist;
    closest = { ...c, position: rotatedPos }; // use rotated pos
  }
}
