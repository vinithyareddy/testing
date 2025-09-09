import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

type CountryCost = { country: string; region: string; cost: number };
type RegionGroup = { region: string; total: number; countries: CountryCost[], expanded?: boolean };

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  // ✅ Dummy cost data (only a few countries)
  laborData: CountryCost[] = [
    { country: 'United States of America', region: 'North America', cost: 57 },
    { country: 'Mexico', region: 'North America', cost: 3 },
    { country: 'Brazil', region: 'South America', cost: 12 },
    { country: 'Argentina', region: 'South America', cost: 9 },
    { country: 'Colombia', region: 'South America', cost: 5 }
  ];

  // ✅ Region groups for legend
  regionGroups: RegionGroup[] = [];

  // ✅ Region colors
  REGION_COLORS: Record<string, string> = {
    'North America': '#3c87d7', // medium blue
    'South America': '#144c88', // dark blue
    'default': '#ffffff'        // white
  };

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
    (globe as any).globeMaterial(new THREE.MeshPhongMaterial({ color: 0x84c9f6 })); // 🌍 globe background color

    const countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    // ✅ Assign regions automatically
    const regionLookup = (name: string): string => {
      if (['United States of America', 'Canada', 'Mexico'].includes(name)) return 'North America';
      if (['Brazil', 'Argentina', 'Colombia', 'Chile', 'Peru'].includes(name)) return 'South America';
      return 'default';
    };

    globe
      .polygonsData(countries.features)
      .polygonCapColor((d: any) => {
        const region = regionLookup(d.properties.name);
        return this.REGION_COLORS[region] || this.REGION_COLORS.default;
      })
      .polygonSideColor(() => 'rgba(0,0,0,0.1)')
      .polygonStrokeColor(() => '#111');

    scene.add(globe);

    // ✅ Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    // ✅ Orbit Controls (rotate with mouse)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;

    // ✅ Build legend
    const grouped: Record<string, CountryCost[]> = {};
    for (const item of this.laborData) {
      (grouped[item.region] ||= []).push(item);
    }
    this.regionGroups = Object.keys(grouped).map(region => {
      const countries = grouped[region];
      const total = countries.reduce((s, c) => s + c.cost, 0);
      return { region, total, countries, expanded: false };
    });

    // ✅ Animate loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }

  toggleExpand(group: RegionGroup) {
    group.expanded = !group.expanded;
  }
}
<div class="globe-wrapper">
  <div #globeContainer class="globe-container"></div>

  <div class="legend">
    <h3>Average Labor cost by Region</h3>
    <ul>
      <li *ngFor="let group of regionGroups">
        <span (click)="toggleExpand(group)">
          ▶ {{ group.region }} — ${{ group.total }}
        </span>
        <ul *ngIf="group.expanded">
          <li *ngFor="let c of group.countries">
            &nbsp;&nbsp;• {{ c.country }} — ${{ c.cost }}
          </li>
        </ul>
      </li>
    </ul>
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
  font-size: 0.9rem;
}

.legend h3 {
  margin-top: 0;
  text-align: center;
}

.legend ul {
  list-style: none;
  padding: 0;
}

.legend li {
  cursor: pointer;
  margin: 6px 0;
}
