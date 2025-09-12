const texture = new THREE.CanvasTexture(canvas);
texture.minFilter = THREE.LinearFilter;   // smooth scaling
texture.magFilter = THREE.LinearFilter;
texture.anisotropy = 16;
texture.generateMipmaps = false;
texture.premultiplyAlpha = true;          // ✅ removes shadowy halos

const spriteMaterial = new THREE.SpriteMaterial({
  map: texture,
  transparent: true,
  depthTest: false,   // ✅ don't let globe occlude text
  depthWrite: false,  // ✅ don't write into depth buffer
  alphaTest: 0.5,     // ✅ cut off faint edges
});
spriteMaterial.needsUpdate = true;
