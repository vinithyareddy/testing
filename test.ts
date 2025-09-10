this.globe.showGraticules(true);

// only set the material if the method exists (newer three-globe)
if ('graticulesMaterial' in this.globe) {
  this.globe.graticulesMaterial(
    new THREE.LineBasicMaterial({ color: 0x3a8bbf, opacity: 0.25, transparent: true })
  );
}
