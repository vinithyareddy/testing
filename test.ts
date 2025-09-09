import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json'; // needs "resolveJsonModule": true in tsconfig

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  laborData = [
    { region: 'United States', cost: 57 },
    { region: 'Canada', cost: 7 },
    { region: 'Mexico', cost: 3 },
    { region: 'South America', cost: 3 },
    { region: 'Europe', cost: 11 },
    { region: 'Africa', cost: 19 },
    { region: 'Asia', cost: 20 },
    { region: 'Oceania', cost: 13 },
    { region: 'Antarctica', cost: 5 }
  ];

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

    // 🌍 Globe base
    const globe: any = new Globe().showGlobe(true).showGraticules(false);

    globe.setPointOfView({ lat: 20, lng: 0, altitude: 2 });

    // 🗺 Country polygons (force cast to any so TS is happy)
    const countries: any = (topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as any).features;

    // Helper: get cost for region
    const getCost = (region: string) => {
      const found = this.laborData.find(d => d.region === region);
      return found ? found.cost : null;
    };

    // Color scale
    const getColor = (region: string) => {
      const cost = getCost(region);
      if (cost === null) return 'lightgrey';
      if (cost > 20) return '#084594';
      if (cost > 10) return '#2171b5';
      if (cost > 5) return '#4292c6';
      if (cost > 0) return '#6baed6';
      return '#c6dbef';
    };

    globe
      .polygonsData(countries)
      .polygonCapColor((d: any) => getColor(d.properties.name))
      .polygonSideColor(() => 'rgba(0,0,0,0.1)')
      .polygonStrokeColor(() => '#111');

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
        const cost = getCost(region);
        if (cost !== null) {
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
