<div class="globe-wrapper">
  <div #globeContainer class="globe-container"></div>

  <div class="legend">
    <h3>Average Labor cost by Region</h3>
    <table>
      <thead>
        <tr>
          <th>Region and Country</th>
          <th>Average Cost</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let region of laborData">
          <td><b>{{ region.region }}</b></td>
          <td>${{ region.cost }}</td>
        </tr>
        <ng-container *ngFor="let region of laborData">
          <tr *ngFor="let c of region.countries">
            <td style="padding-left: 20px">• {{ c.country }}</td>
            <td>${{ c.cost }}</td>
          </tr>
        </ng-container>
      </tbody>
    </table>
  </div>
</div>


import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  // 👇 Data now structured as regions with countries
  laborData = [
    {
      region: 'North America',
      cost: 67,
      countries: [
        { country: 'United States of America', cost: 57 },
        { country: 'Canada', cost: 7 },
        { country: 'Mexico', cost: 3 }
      ]
    },
    {
      region: 'South America',
      cost: 3,
      countries: [{ country: 'Brazil', cost: 3 }]
    },
    {
      region: 'Europe',
      cost: 11,
      countries: [{ country: 'France', cost: 11 }]
    },
    {
      region: 'Africa',
      cost: 19,
      countries: [{ country: 'Nigeria', cost: 19 }]
    },
    {
      region: 'Asia',
      cost: 20,
      countries: [{ country: 'India', cost: 20 }]
    },
    {
      region: 'Oceania',
      cost: 13,
      countries: [{ country: 'Australia', cost: 13 }]
    },
    {
      region: 'Antarctica',
      cost: 5,
      countries: [{ country: 'Antarctica', cost: 5 }]
    }
  ];

  // Map countries → region
  private countryToRegion: { [key: string]: string } = {
    'United States of America': 'North America',
    Canada: 'North America',
    Mexico: 'North America',
    Brazil: 'South America',
    France: 'Europe',
    Nigeria: 'Africa',
    India: 'Asia',
    Australia: 'Oceania',
    Antarctica: 'Antarctica'
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

    (globe as any).globeMaterial(
      new THREE.MeshPhongMaterial({ color: 0x87cefa })
    );

    // Helper: region cost lookup
    const getRegionCost = (region: string) => {
      const found = this.laborData.find((d) => d.region === region);
      return found ? found.cost : null;
    };

    // Color by region
    const getRegionColor = (countryName: string) => {
      const region = this.countryToRegion[countryName];
      if (!region) return 'lightgrey';

      const cost = getRegionCost(region);
      if (cost === null) return 'lightgrey';
      if (cost > 40) return '#08306b';
      if (cost > 20) return '#2171b5';
      if (cost > 10) return '#6baed6';
      return '#c6dbef';
    };

    // Convert TopoJSON → GeoJSON
    const countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    // Apply polygons with region-based colors
    globe
      .polygonsData(countries.features)
      .polygonCapColor((d: any) => getRegionColor(d.properties.name))
      .polygonSideColor(() => 'rgba(0,0,0,0.1)')
      .polygonStrokeColor(() => '#111');

    scene.add(globe);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }
}


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

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th,
td {
  padding: 6px 10px;
  text-align: left;
}

thead {
  background: rgba(255, 255, 255, 0.2);
}
