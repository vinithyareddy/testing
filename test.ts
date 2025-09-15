focusOnCountry(country: CountrySkill) {
  if (!country.position) return;

  // --- Move camera to look at the country ---
  const targetPos = country.position.clone().normalize().multiplyScalar(RADIUS + 40);

  // update OrbitControls target
  this.controls.target.copy(country.position.clone().normalize().multiplyScalar(RADIUS));

  // move camera directly (later you can add gsap for smooth animation)
  this.camera.position.copy(targetPos);
  this.controls.update();

  // --- Add temporary highlight marker ---
  const highlight = new THREE.Mesh(
    new THREE.SphereGeometry(2, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  highlight.position.copy(country.position);
  this.scene.add(highlight);

  // remove after 2s
  setTimeout(() => {
    this.scene.remove(highlight);
  }, 2000);
}


<div *ngFor="let c of filteredList"
     class="country-card"
     (click)="focusOnCountry(c)">
  <div class="country-header">
    <img [src]="'https://flagcdn.com/24x18/' + c.code.toLowerCase() + '.png'" class="flag-icon" />
    <div class="country-name">{{ c.country }}</div>
  </div>
  <div class="metrics">
    <div class="metric-labels">
      <span>Unique Skills</span>
      <span>Skill Supply (FTE)</span>
    </div>
    <div class="metric-values">
      <span>{{ c.uniqueSkills }}</span>
      <span>{{ c.skillSupply }}</span>
    </div>
  </div>
</div>
