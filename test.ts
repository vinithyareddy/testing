<div #globeContainer class="globe-wrapper">

  <!-- Map Modes Toolbar -->
  <div class="map-modes">
    <button (click)="setMode('satellite')"><i class="fas fa-globe"></i> Satellite</button>
    <button (click)="setMode('terrain')"><i class="fas fa-mountain"></i> Terrain</button>
    <button (click)="setMode('political')"><i class="fas fa-flag"></i> Political</button>
    <button (click)="toggleRotation()"><i class="fas fa-sync"></i> Rotate</button>
    <button><i class="fas fa-ellipsis-h"></i> More</button>
  </div>

  <!-- Existing zoom buttons -->
  <div class="zoom-container">
    <button (click)="zoomIn()">+</button>
    <button (click)="zoomOut()">-</button>
  </div>

</div>


.map-modes {
    position: absolute;
    top: 20px;
    left: 20px;
    display: flex;
    gap: 8px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 6px;
    padding: 6px 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    z-index: 2000;
  
    button {
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
  
      &:hover {
        background: #f0f0f0;
      }
    }
  }

  
  private rotationEnabled = true;
private earthMaterial!: THREE.MeshPhongMaterial;


this.earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTex,
    specular: new THREE.Color(0x222222),
    shininess: 3
  });
  
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS, 75, 75),
    this.earthMaterial
  );

  
  setMode(mode: 'satellite' | 'terrain' | 'political') {
    const texLoader = new THREE.TextureLoader();
  
    if (mode === 'satellite') {
      this.earthMaterial.map = texLoader.load(
        'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
      );
    } else if (mode === 'terrain') {
      this.earthMaterial.map = texLoader.load(
        'https://unpkg.com/three-globe/example/img/earth-topology.png'
      );
    } else if (mode === 'political') {
      this.earthMaterial.map = texLoader.load(
        'https://unpkg.com/three-globe/example/img/earth-night.jpg'
      );
    }
  
    this.earthMaterial.needsUpdate = true;
  }
  
  toggleRotation() {
    this.rotationEnabled = !this.rotationEnabled;
  }

  
  if (this.rotationEnabled && !this.isFocusing) {
    this.globeGroup.rotation.y += ROTATION_SPEED;
  }
  