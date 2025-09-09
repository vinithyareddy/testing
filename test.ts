import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';

type CountryCost = { country: string; region: string; cost: number };

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  // ✅ Dummy data (region already included)
  laborData: CountryCost[] = [
    { country: 'United States of America', region: 'North America', cost: 57 },
    { country: 'Canada', region: 'North America', cost: 7 },
    { country: 'Mexico', region: 'North America', cost: 3 },
    { country: 'Brazil', region: 'South America', cost: 3 },
    { country: 'France', region: 'Europe', cost: 11 },
    { country: 'Nigeria', region: 'Africa', cost: 19 },
    { country: 'India', region: 'Asia', cost: 20 },
    { country: 'Australia', region: 'Oceania', cost: 13 },
    { country: 'Antarctica', region: 'Antarctica', cost: 5 }
  ];

  // ✅ Region colors
  REGION_COLORS: Record<string, string> = {
    'North America': '#2D75FF',
    'South America': '#FF4D4F',
    'Europe': '#5A6AFF',
    'Africa': '#2BC48A',
    'Asia': '#FFAA00',
    'Oceania': '#8A63D2',
    'Antarctica': '#B0C4DE'
  };

  // ✅ Legend grouped by region
  regionAverages: { region: string; avgCost: number; countries: CountryCost[] }[] = [];

  ngAfterViewInit() {
    const globeDiv = this.globeContainer.nativeElement;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(globeDiv.offsetWidth, globeDiv.offsetHeight);
    globeDiv.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      globeDiv.offsetWidth / globeDiv.offsetHeight,
      0.1,
      1000
    );
    camera.position.z = 170;

    const globe: any = new Globe().showGlobe(true).showGraticules(false);
    (globe as any).globeMaterial(new THREE.MeshPhongMaterial({ color: 0x87cefa }));

    // 🌍 Countries
    const countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    globe
      .polygonsData(countries.features)
      .polygonCapColor((d: any) => {
        const item = this.laborData.find(c => c.country === d.properties.name);
        return item ? this.REGION_COLORS[item.region] : '#e8eff6';
      })
      .polygonSideColor(() => 'rgba(0,0,0,0.1)')
      .polygonStrokeColor(() => '#10283b');

    scene.add(globe);

    // 💡 Lights
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // 🎥 Enable orbit controls (drag to move globe)
    const controls = new (require('three/examples/jsm/controls/OrbitControls').OrbitControls)(
      camera,
      renderer.domElement
    );
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 120;
    controls.maxDistance = 300;

    // 🔢 Build region averages for legend
    const grouped: Record<string, CountryCost[]> = {};
    for (const c of this.laborData) {
      (grouped[c.region] ||= []).push(c);
    }
    this.regionAverages = Object.keys(grouped).map(region => {
      const arr = grouped[region];
      const avg = Math.round(arr.reduce((s, x) => s + x.cost, 0) / arr.length);
      arr.sort((a, b) => b.cost - a.cost);
      return { region, avgCost: avg, countries: arr };
    });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }
}


<div class="globe-wrapper">
  <div #globeContainer class="globe-container"></div>

  <div class="legend">
    <h3>Average Labor cost by Region</h3>
    <div *ngFor="let group of regionAverages">
      <details>
        <summary>
          {{ group.region }} — ${{ group.avgCost }}
        </summary>
        <ul>
          <li *ngFor="let c of group.countries">
            {{ c.country }} — ${{ c.cost }}
          </li>
        </ul>
      </details>
    </div>
  </div>
</div>


.globe-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #154361;
  padding: 15px;
  border-radius: 10px;
  color: #fff;
}

.globe-container {
  width: 70%;
  height: 600px;
}

.legend {
  width: 28%;
  background: #0b3d91;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.legend h3 {
  margin-top: 0;
  font-size: 1.2rem;
  text-align: center;
}

details summary {
  cursor: pointer;
  font-weight: bold;
  margin: 5px 0;
}

ul {
  padding-left: 15px;
  margin: 0;
}

li {
  font-size: 0.9rem;
  margin: 2px 0;
}
