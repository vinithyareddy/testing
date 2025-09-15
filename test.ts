focusOnCountry(country: CountrySkill) {
  if (!country) return;
  this.isFocusing = true;

  // Base position from lat/lng (globe local space)
  const basePos = this.latLngToVector3(country.lat, country.lng, RADIUS);

  // Direction from globe center to country
  const targetDir = basePos.clone().normalize();

  // Camera forward (-Z in world space)
  const camDir = new THREE.Vector3();
  this.camera.getWorldDirection(camDir);

  // Step 1: rotate so country faces camera
  const q1 = new THREE.Quaternion().setFromUnitVectors(targetDir, camDir.negate());
  this.globeGroup.quaternion.premultiply(q1);

  // Step 2: fix roll so north pole stays up
  const globeUp = new THREE.Vector3(0, 1, 0).applyQuaternion(this.globeGroup.quaternion);
  const screenUp = new THREE.Vector3(0, 1, 0); // keep Y-up

  // Project onto plane perpendicular to camera forward
  const camForward = camDir.clone().normalize();
  globeUp.projectOnPlane(camForward).normalize();
  screenUp.projectOnPlane(camForward).normalize();

  // Angle between projected ups
  let angle = Math.acos(THREE.MathUtils.clamp(globeUp.dot(screenUp), -1, 1));

  // Cross product tells rotation direction
  const cross = new THREE.Vector3().crossVectors(globeUp, screenUp);
  if (cross.dot(camForward) < 0) angle = -angle;

  // Apply roll correction
  this.globeGroup.rotateOnAxis(camForward, angle);

  // Controls remain centered
  this.controls.target.set(0, 0, 0);
  this.controls.update();

  // Temporary highlight
  const highlight = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  highlight.position.copy(basePos);
  this.globeGroup.add(highlight);

  setTimeout(() => {
    this.globeGroup.remove(highlight);
    this.isFocusing = false;
  }, 2000);
}
