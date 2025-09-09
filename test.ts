import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  // Dummy labor cost data (simple array)
  laborData: { [key: string]: number } = {
    'United States': 57,
    'Canada': 7,
    'Mexico': 3,
    'South America': 3,
    'Europe': 11,
    'Africa': 19,
    'Asia': 20,
    'Oceania': 13,
    'Antarctica': 5
  };

  ngAfterViewInit() {
    const globeDiv = this.globeContainer.nativeElement;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(globeDiv.offsetWidth, globeDiv.offsetHeight);
    renderer.setClearColor(0x000000, 0); // transparent
    globeDiv.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      globeDiv.offsetWidth / globeDiv.offsetHeight,
      0.1,
      1000
    );
    camera.position.z = 200;

    // 🌍 Simple globe with polygons from a public GeoJSON
    const globe: any = new Globe()
      .showGlobe(true)
      .showGraticules(false)
      .polygonsData([])
      .polygonCapColor(() => '#87CEFA') // default until data loads
      .polygonSideColor(() => 'rgba(0,0,0,0.1)')
      .polygonStrokeColor(() => '#111');

    // Load country polygons directly (no topojson import needed)
    fetch('//unpkg.com/world-atlas/countries-110m.geojson')
      .then(res => res.json())
      .then(countries => {
        globe.polygonsData(countries.features).polygonCapColor((d: any) => {
          const region = d.properties.name;
          const cost = this.laborData[region];
          if (!cost) return 'lightgrey';
          if (cost > 20) return '#084594';
          if (cost > 10) return '#2171b5';
          if (cost > 5) return '#4292c6';
          return '#6baed6';
        });
      });

    // 📌 Tooltip
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'white';
    tooltip.style.color = 'black';
    tooltip.style.padding = '4px 8px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    globe.onPolygonHover((polygon: any) => {
      if (polygon) {
        const region = polygon.properties.name;
        const cost = this.laborData[region];
        if (cost) {
          tooltip.style.display = 'block';
          tooltip.innerHTML = `<b>${region}</b><br/>Average Cost: $${cost}`;
        } else {
          tooltip.style.display = 'none';
        }
      } else {
        tooltip.style.display = 'none';
      }
    });

    window.addEventListener('mousemove', (e) => {
      tooltip.style.left = e.pageX + 10 + 'px';
      tooltip.style.top = e.pageY + 10 + 'px';
    });

    scene.add(globe);

    // 💡 Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // 🎥 Animate (no rotation)
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }
}
