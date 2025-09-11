// --- basemap & atmosphere ---
const BLUE_MARBLE = 'https://unpkg.com/three-globe@2.30.0/example/img/earth-blue-marble.jpg';
const TOPO_BUMP   = 'https://unpkg.com/three-globe@2.30.0/example/img/earth-topology.png';
const STARRY_BG   = 'https://unpkg.com/three-globe@2.30.0/example/img/night-sky.png'; // optional

this.globe
  .globeImageUrl(BLUE_MARBLE)   // ocean/land texture
  .bumpImageUrl(TOPO_BUMP)      // subtle relief shading
  .backgroundImageUrl(STARRY_BG) // (optional) space backdrop
  .showAtmosphere(true)
  .atmosphereColor('#9ec2ff')
  .atmosphereAltitude(0.25);


  this.globe
  .polygonsData(this.countries.features)
  .polygonCapColor(() => 'rgba(0,0,0,0)') // transparent interior
  .polygonSideColor(() => 'rgba(0,0,0,0)')
  .polygonStrokeColor(() => '#ffffff')
  .polygonAltitude(0.003);                // lift borders above the texture
