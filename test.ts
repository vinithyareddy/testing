const texLoader = new THREE.TextureLoader();

const earthTex = texLoader.load(
  'https://unpkg.com/three-globe@2.30.0/example/img/earth-blue-marble.jpg'
);
const bumpTex  = texLoader.load(
  'https://unpkg.com/three-globe@2.30.0/example/img/earth-topology.png'
);
const starsTex = texLoader.load(
  'https://unpkg.com/three-globe@2.30.0/example/img/night-sky.png'
);
