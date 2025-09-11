this.globe = new Globe()
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-light.jpg') // lighter texture
  .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
  .showGraticules(true)
  .showAtmosphere(true);

// Softer atmosphere glow
this.globe.atmosphereColor('#88ccff');
this.globe.atmosphereAltitude(0.35);
