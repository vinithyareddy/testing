// ONLY ADD THESE LINES TO YOUR EXISTING TypeScript FILE:

// 1. Add these new properties to your class (around line 45, after existing properties):
selectedCountry: CountrySkill | null = null;
private highlightGroup!: THREE.Group;

// 2. Add this new method (can be added anywhere in the class):
selectCountry(country: CountrySkill) {
  this.selectedCountry = country;
  this.highlightCountryOnGlobe(country);
}

// 3. Add this new method (can be added anywhere in the class):
private highlightCountryOnGlobe(country: CountrySkill) {
  // Clear existing highlights
  if (this.highlightGroup) {
    this.globeGroup.remove(this.highlightGroup);
  }
  
  this.highlightGroup = new THREE.Group();
  this.globeGroup.add(this.highlightGroup);

  if (country.position) {
    // Create a pulsing ring around the country
    const ringGeometry = new THREE.RingGeometry(2, 4, 16);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    
    // Position the ring at the country's location
    const ringPosition = country.position.clone().normalize();
    ringPosition.multiplyScalar(RADIUS + 1);
    ring.position.copy(ringPosition);
    
    // Make the ring face outward
    ring.lookAt(ringPosition.clone().multiplyScalar(2));
    
    this.highlightGroup.add(ring);

    // Create a glowing sphere
    const sphereGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.9
    });
    
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.copy(ringPosition);
    this.highlightGroup.add(sphere);

    // Animate the highlight
    this.animateHighlight(ring, sphere);
  }
}

// 4. Add this new method (can be added anywhere in the class):
private animateHighlight(ring: THREE.Mesh, sphere: THREE.Mesh) {
  const animate = () => {
    if (this.highlightGroup && this.highlightGroup.children.includes(ring)) {
      // Pulse the ring
      const time = Date.now() * 0.003;
      const scale = 1 + Math.sin(time) * 0.3;
      ring.scale.setScalar(scale);
      
      // Pulse the sphere opacity
      const sphereMaterial = sphere.material as THREE.MeshBasicMaterial;
      sphereMaterial.opacity = 0.6 + Math.sin(time * 2) * 0.3;
      
      requestAnimationFrame(animate);
    }
  };
  animate();
}

// 5. In your existing ngAfterViewInit method, ONLY ADD this single line after you create globeGroup:
// Find this existing code block:
// this.globeGroup = new THREE.Group();
// this.globeGroup.add(this.globe);
// this.globeGroup.add(earth);
// this.scene.add(this.globeGroup);

// ADD this line after the above block:
this.highlightGroup = new THREE.Group();
this.globeGroup.add(this.highlightGroup);

// THAT'S IT! Everything else in your TypeScript file stays exactly the same.

// HTML CHANGES - ONLY CHANGE THIS ONE LINE:
// Find your existing country card div:
// <div *ngFor="let c of filteredList" class="country-card">

// Replace it with:
// <div *ngFor="let c of filteredList" class="country-card" (click)="selectCountry(c)">

// SCSS CHANGES - ONLY ADD THESE STYLES:
// Add to your existing .country-card styles:
.country-card {
  // ... your existing styles stay the same ...
  cursor: pointer; // ADD this line
  
  // ADD this new state:
  &.selected {
    background: #eff6ff;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
}

// OPTIONAL: If you want visual selection in the legend, add this to HTML:
// <div *ngFor="let c of filteredList" 
//      class="country-card" 
//      [class.selected]="selectedCountry?.code === c.code"
//      (click)="selectCountry(c)">