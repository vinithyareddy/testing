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

  // Dummy data (only a few countries per region for simplicity)
  laborData: CountryCost[] = [
    { country: 'United States of America', region: 'North America', cost: 57 },
    { country: 'Canada', region: 'North America', cost: 7 },
    { country: 'Mexico', region: 'North America', cost: 3 },
    { country: 'Brazil', region: 'South America', cost: 12 },
    { country: 'Argentina', region: 'South America', cost: 9 },
    { country: 'Colombia', region: 'South America', cost: 5 }
  ];

  // Computed region → grouped countries
  regionGroups: { region: string; total: number; countries: CountryCost[]; expanded?: boolean }[] = [];

  REGION_COLORS: Record<string, string> = {
    'North America': '#4682B4', // medium blue
    'South America': '#08306b', // dark blue
    'default': '#ffffff'        // white for others
  };

  ngAfterViewInit() {
    // --- Compute legend data
    const grouped: Record<string, CountryCost[]> = {};
    for (const item of this.laborData) {
      (grouped[item.region] ||= []).push(item);
    }
    this.regionGroups = Object.keys(grouped).map(region => {
      const countries = grouped[region];
      const total = countries.reduce((s, c) => s + c.cost, 0);
      return { region, total, countries, expanded: false };
    });

    // --- Globe setup
    const globeDiv = this.globeContainer.nativeElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(globeDiv.offsetWidth, globeDiv.offsetHeight);
    globeDiv.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, globeDiv.offsetWidth / globeDiv.offsetHeight, 0.1, 1000);
    camera.position.z = 170;

    const globe: any = new Globe().showGlobe(true).showGraticules(false);
    (globe as any).globeMaterial(new THREE.MeshPhongMaterial({ color: 0x87cefa }));

    const countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    globe
      .polygonsData(countries.features)
      .polygonCapColor((d: any) => {
        const match = this.laborData.find(c => c.country === d.properties.name);
        if (match) {
          return this.REGION_COLORS[match.region] || this.REGION_COLORS['default'];
        }
        return this.REGION_COLORS['default'];
      })
      .polygonSideColor(() => 'rgba(0,0,0,0.2)')
      .polygonStrokeColor(() => '#333');

    scene.add(globe);

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }
}


<div class="globe-wrapper">
  <div #globeContainer class="globe-container"></div>

  <div class="legend">
    <h3>Average Labor cost by Region</h3>
    <div *ngFor="let group of regionGroups">
      <div class="region-row" (click)="group.expanded = !group.expanded">
        ▶ {{ group.region }} — ${{ group.total }}
      </div>
      <div *ngIf="group.expanded" class="country-list">
        <div *ngFor="let c of group.countries" class="country-row">
          &nbsp;&nbsp;&nbsp;{{ c.country }} — ${{ c.cost }}
        </div>
      </div>
    </div>
  </div>
</div>


.globe-wrapper {
  display: flex;
  justify-content: space-between;
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
  font-size: 0.9rem;
}

.region-row {
  cursor: pointer;
  padding: 5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.country-list {
  margin-left: 10px;
  font-size: 0.85rem;
  color: #ddd;
}
