const globeGroup = new THREE.Group();
globeGroup.add(this.globe);
this.scene.add(globeGroup);

this.labelGroup = new THREE.Group();
globeGroup.add(this.labelGroup);
