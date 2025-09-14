const earth = new THREE.Mesh(
  new THREE.SphereGeometry(RADIUS, 75, 75),
  new THREE.MeshPhongMaterial({
    color: new THREE.Color(DEFAULT_GLOBE_COLOR),
    shininess: 3
  })
);
scene.add(earth);
