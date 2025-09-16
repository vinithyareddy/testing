<div class="map-modes">
  <button (click)="setMode('satellite')"><i class="fas fa-globe"></i> Satellite</button>
  <button (click)="setMode('terrain')"><i class="fas fa-mountain"></i> Terrain</button>
  <button (click)="setMode('transit')"><i class="fas fa-subway"></i> Transit</button>
  <button (click)="setMode('biking')"><i class="fas fa-bicycle"></i> Biking</button>

  <div class="dropdown">
    <button class="dropdown-btn"><i class="fas fa-ellipsis-h"></i> More</button>
    <div class="dropdown-content">
      <a (click)="setMode('night')"><i class="fas fa-moon"></i> Night</a>
      <a (click)="setMode('political')"><i class="fas fa-flag"></i> Political</a>
      <a (click)="setMode('minimal')"><i class="fas fa-border-none"></i> Minimal</a>
    </div>
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
  
    button, .dropdown-btn {
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
  
    .dropdown {
      position: relative;
  
      .dropdown-content {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        min-width: 150px;
        z-index: 3000;
  
        a {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          font-size: 13px;
          color: #333;
          text-decoration: none;
          cursor: pointer;
  
          &:hover {
            background: #f5f5f5;
          }
        }
      }
  
      &:hover .dropdown-content {
        display: block;
      }
    }
  }
  

  setMode(mode: string) {
    const texLoader = new THREE.TextureLoader();
  
    switch (mode) {
      case 'satellite':
        this.earthMaterial.map = texLoader.load(
          'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
        );
        break;
  
      case 'terrain':
        this.earthMaterial.map = texLoader.load(
          'https://unpkg.com/three-globe/example/img/earth-topology.png'
        );
        break;
  
      case 'transit':
        this.earthMaterial.map = texLoader.load(
          'https://unpkg.com/three-globe/example/img/earth-railways.png'
        );
        break;
  
      case 'biking':
        this.earthMaterial.map = texLoader.load(
          'https://unpkg.com/three-globe/example/img/earth-bike.png'
        );
        break;
  
      case 'night':
        this.earthMaterial.map = texLoader.load(
          'https://unpkg.com/three-globe/example/img/earth-night.jpg'
        );
        break;
  
      case 'political':
        this.earthMaterial.map = texLoader.load(
          'https://unpkg.com/three-globe/example/img/earth-political.png'
        );
        break;
  
      case 'minimal':
        this.earthMaterial.map = texLoader.load(
          'https://unpkg.com/three-globe/example/img/earth-minimal.png'
        );
        break;
    }
  
    this.earthMaterial.needsUpdate = true;
  }
  