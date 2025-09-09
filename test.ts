<div class="globe-wrapper">
  <div #globeContainer class="globe-container"></div>

  <div class="legend">
    <h3>Average Labor cost by country</h3>
    <table>
      <thead>
        <tr>
          <th>Location</th>
          <th>Average Cost</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let c of laborData">
          <td>
            <span class="flag">{{ getFlagEmoji(c.code) }}</span>
            {{ c.country }}
          </td>
          <td>\${{ c.cost }}</td>
        </tr>
      </tbody>
    </table>
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
  color: #fff;
}

.legend h3 {
  margin-top: 0;
  text-align: center;
}

.legend table {
  width: 100%;
  border-collapse: collapse;
}

.legend th,
.legend td {
  padding: 6px 8px;
  text-align: left;
}

.legend th {
  border-bottom: 1px solid #ccc;
}

.flag {
  margin-right: 6px;
  font-size: 18px;
}


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

  // Dummy data with ISO codes
  laborData: CountryCost[] = [
    { country: 'United States of America', region: 'North America', cost: 57, code: 'US' },
    { country: 'Canada', region: 'North America', cost: 7, code: 'CA' },
    { country: 'Mexico', region: 'North America', cost: 3, code: 'MX' },
    { country: 'Brazil', region: 'South America', cost: 12, code: 'BR' },
    { country: 'Argentina', region: 'South America', cost: 9, code: 'AR' },
    { country: 'Colombia', region: 'South America', cost: 5, code: 'CO' }
  ];

  REGION_COLORS: Record<string, string> = {
    'North America': '#3c87d7', // medium blue
    'South America': '#144c88', // dark blue
    'Other': '#ffffff'          // white
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
    (globe as any).globeMaterial(
      new THREE.MeshBasicMaterial({ color: new THREE.Color('#84c9f6') }) // exact flat light blue
    );

    const countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    const getRegion = (countryName: string): string => {
      const northAmerica = [
        'United States of America', 'Canada', 'Mexico',
        'Guatemala', 'Belize', 'Honduras', 'El Salvador',
        'Nicaragua', 'Costa Rica', 'Panama',
        'Cuba', 'Haiti', 'Dominican Republic', 'Jamaica',
        'Bahamas', 'Trinidad and Tobago', 'Barbados',
        'Saint Lucia', 'Grenada', 'Saint Vincent and the Grenadines',
        'Antigua and Barbuda', 'Dominica', 'Saint Kitts and Nevis'
      ];

      const southAmerica = [
        'Brazil', 'Argentina', 'Colombia', 'Chile', 'Peru',
        'Ecuador', 'Venezuela', 'Bolivia', 'Uruguay', 'Paraguay',
        'Guyana', 'Suriname', 'French Guiana'
      ];

      if (northAmerica.includes(countryName)) return 'North America';
      if (southAmerica.includes(countryName)) return 'South America';
      return 'Other';
    };

    globe
      .polygonsData(countries.features)
      .polygonCapColor((d: any) => {
        const region = getRegion(d.properties.name);
        return this.REGION_COLORS[region] || this.REGION_COLORS['Other'];
      })
      .polygonSideColor(() => 'rgba(0,0,0,0.2)')
      .polygonStrokeColor(() => '#111');

    scene.add(globe);

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }

  // ✅ Convert ISO code to emoji flag
  getFlagEmoji(code: string): string {
    return code
      .toUpperCase()
      .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
  }
}
