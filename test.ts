import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

type CountryCost = { country: string; region: string; cost: number; code: string };

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  // ✅ Dummy data only
  laborData: CountryCost[] = [
    { country: 'United States of America', region: 'North America', cost: 57, code: 'US' },
    { country: 'Canada', region: 'North America', cost: 7, code: 'CA' },
    { country: 'Mexico', region: 'North America', cost: 3, code: 'MX' },
    { country: 'Brazil', region: 'South America', cost: 12, code: 'BR' },
    { country: 'Argentina', region: 'South America', cost: 9, code: 'AR' },
    { country: 'Colombia', region: 'South America', cost: 5, code: 'CO' },
    { country: 'Germany', region: 'Europe', cost: 11, code: 'DE' },
    { country: 'Nigeria', region: 'Africa', cost: 19, code: 'NG' },
    { country: 'India', region: 'Asia', cost: 20, code: 'IN' },
    { country: 'Australia', region: 'Oceania', cost: 13, code: 'AU' },
    { country: 'Antarctica', region: 'Antarctica', cost: 5, code: 'AQ' }
  ];

  regionGroups: { region: string; total: number; countries: CountryCost[]; expanded?: boolean }[] = [];

  // ✅ Only region color mapping is fixed
  REGION_COLORS: Record<string, string> = {
    'North America': '#3c87d7',
    'South America': '#144c88',
    'Europe': '#999999',
    'Africa': '#666666',
    'Asia': '#bbbbbb',
    'Oceania': '#aaaaaa',
    'Antarctica': '#dddddd',
    'Other': '#adcdee'
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
    camera.position.z = 180;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.8;

    const globe: any = new Globe().showGlobe(true).showGraticules(false);
    globe.globeMaterial(
      new THREE.MeshBasicMaterial({ color: new THREE.Color('#84c9f6') })
    );

    const countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    // ✅ Use region directly from laborData (no hardcoded arrays!)
    globe
      .polygonsData(countries.features)
      .polygonCapColor((d: any) => {
        const match = this.laborData.find(c => c.country === d.properties.name);
        return match ? this.REGION_COLORS[match.region] : this.REGION_COLORS['Other'];
      })
      .polygonSideColor(() => '#84c9f6');

    scene.add(globe);

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // ✅ Grouping based on laborData only
    const grouped: Record<string, CountryCost[]> = {};
    for (const c of this.laborData) {
      (grouped[c.region] ||= []).push(c);
    }
    this.regionGroups = Object.keys(grouped).map(region => {
      const arr = grouped[region];
      const total = arr.reduce((s, x) => s + x.cost, 0);
      return { region, total, countries: arr, expanded: false };
    });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }

  expandRow(region: any) {
    region.expanded = !region.expanded;
  }
}


.globe-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #154361;
  padding: 15px;
  color: #fff;
}

.globe-container {
  width: 70%;
  height: 600px;
}

.legend-wrapper {
  margin-top: 120px;
  margin-right: 20px;
  width: 25%;
  display: flex;
  flex-direction: column;
}

.legend-title {
  margin-bottom: 15px;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: left;
  color: #fff;
}

.legend-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  font-size: 0.9rem;
  color: #000;
  border-radius: 0;
}

.legend-table th,
.legend-table td {
  padding: 10px;
}

.legend-table th.left {
  text-align: left;
}

.legend-table th.right {
  text-align: right;
}

.legend-table td.cost-col {
  text-align: right;
}

.legend-table tr {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.cell-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.expand-icon {
  font-size: 1rem;
  color: #2083c4;
}

.flag-icon {
  width: 20px;
  margin-right: 8px;
  vertical-align: middle;
}


<div class="globe-wrapper">
  <!-- Globe -->
  <div #globeContainer class="globe-container"></div>

  <!-- Legend -->
  <div class="legend-wrapper">
    <h3 class="legend-title">Average Labor cost by Region</h3>
    <table class="legend-table">
      <thead>
        <tr>
          <th class="left">Region and Country</th>
          <th class="right">Average Cost</th>
        </tr>
      </thead>
      <tbody>
        <ng-container *ngFor="let region of regionGroups">
          <!-- Region row -->
          <tr (click)="expandRow(region)" class="pointer region-row">
            <td>
              <span class="cell-content">
                <i *ngIf="!region.expanded" class="far fa-plus-circle expand-icon"></i>
                <i *ngIf="region.expanded" class="far fa-minus-circle expand-icon"></i>
                {{ region.region }}
              </span>
            </td>
            <td class="cost-col">${{ region.total }}</td>
          </tr>

          <!-- Country rows -->
          <tr *ngFor="let c of region.countries" [hidden]="!region.expanded" class="country-row">
            <td class="country-info">
              <img [src]="'https://flagcdn.com/16x12/' + c.code.toLowerCase() + '.png'" class="flag-icon" />
              {{ c.country }}
            </td>
            <td class="cost-col">${{ c.cost }}</td>
          </tr>
        </ng-container>
      </tbody>
    </table>
  </div>
</div>
