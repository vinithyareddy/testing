private tileBaseUrls: Record<string, string> = {
    satellite: 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/512/{z}/{x}/{y}?access_token=YOUR_MAPBOX_TOKEN',
    terrain: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/512/{z}/{x}/{y}?access_token=YOUR_MAPBOX_TOKEN',
    transit: 'https://api.mapbox.com/styles/v1/mapbox/navigation-night-v1/tiles/512/{z}/{x}/{y}?access_token=YOUR_MAPBOX_TOKEN',
    biking: 'https://api.mapbox.com/styles/v1/mapbox/cycling-v1/tiles/512/{z}/{x}/{y}?access_token=YOUR_MAPBOX_TOKEN',
    night: 'https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/512/{z}/{x}/{y}?access_token=YOUR_MAPBOX_TOKEN',
    political: 'https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/512/{z}/{x}/{y}?access_token=YOUR_MAPBOX_TOKEN'
  };
  

  private createTileMaterial(style: string): THREE.MeshBasicMaterial {
    const loader = new THREE.TextureLoader();
    const url = this.tileBaseUrls[style].replace('{z}', '0').replace('{x}', '0').replace('{y}', '0'); 
    // NOTE: replace with a real tile server that supports zoom levels
  
    const texture = loader.load(url);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  
    return new THREE.MeshBasicMaterial({ map: texture });
  }
  

  setMode(mode: string) {
    if (!this.earth) return;
  
    const newMaterial = this.createTileMaterial(mode);
    this.earth.material = newMaterial;
    this.earth.material.needsUpdate = true;
  }

  
  this.earth = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS, 75, 75),
    this.createTileMaterial('satellite') // default mode
  );
  this.globeGroup.add(this.earth);
  