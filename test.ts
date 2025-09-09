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

  // Dummy data
  laborData: CountryCost[] = [
    { country: 'United States of America', region: 'North America', cost: 57, code: 'US' },
    { country: 'Canada', region: 'North America', cost: 7, code: 'CA' },
    { country: 'Mexico', region: 'North America', cost: 3, code: 'MX' },
    { country: 'Brazil', region: 'South America', cost: 12, code: 'BR' },
    { country: 'Argentina', region: 'South America', cost: 9, code: 'AR' },
    { country: 'Colombia', region: 'South America', cost: 5, code: 'CO' }
  ];

  regionGroups: { region: string; total: number; countries: CountryCost[] }[] = [];

  REGION_COLORS: Record<string, string> = {
    'North America': '#3c87d7',
    'South America': '#144c88',
    'Other': '#ffffff'
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
      new THREE.MeshBasicMaterial({ color: new THREE.Color('#84c9f6') })
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

    // ✅ Group data into regions for the legend
    const grouped: Record<string, CountryCost[]> = {};
    for (const c of this.laborData) {
      (grouped[c.region] ||= []).push(c);
    }
    this.regionGroups = Object.keys(grouped).map(region => {
      const arr = grouped[region];
      const total = arr.reduce((s, x) => s + x.cost, 0);
      return { region, total, countries: arr };
    });

    // Debug
    console.log('Region Groups:', this.regionGroups);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }

  getFlagEmoji(code: string): string {
    return code
      .toUpperCase()
      .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
  }
}


<div class="globe-wrapper">
  <div #globeContainer class="globe-container"></div>

  <div class="legend">
    <h3>Average Labor cost by Region</h3>

    <ul>
      <li *ngFor="let region of regionGroups">
        <details>
          <summary>
            {{ region.region }} — ${{ region.total }}
          </summary>

          <ul>
            <li *ngFor="let c of region.countries" class="country-row">
              <span class="country-info">
                <span class="flag">{{ getFlagEmoji(c.code) }}</span>
                <span class="name">{{ c.country }}</span>
              </span>
              <span class="cost">\${{ c.cost }}</span>
            </li>
          </ul>
        </details>
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
  margin-bottom: 10px;
}

details summary {
  cursor: pointer;
  font-weight: bold;
  margin: 8px 0;
}

.country-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  border-radius: 4px;
  background: #ffffff0d; // slight transparent background
  margin: 4px 0;
}

.country-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.flag {
  font-size: 1.2rem;
}

.name {
  font-size: 0.9rem;
}

.cost {
  font-weight: bold;
}
