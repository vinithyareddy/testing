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

  // Dummy country-level data
  laborData = [
    { country: 'United States of America', cost: 57 },
    { country: 'Canada', cost: 7 },
    { country: 'Mexico', cost: 3 },
    { country: 'Brazil', cost: 3 },
    { country: 'France', cost: 11 },
    { country: 'Nigeria', cost: 19 },
    { country: 'India', cost: 20 },
    { country: 'Australia', cost: 13 },
    { country: 'Antarctica', cost: 5 }
  ];

  // Map each country to a region
  regionMap: Record<string, string> = {
    'United States of America': 'North America',
    'Canada': 'North America',
    'Mexico': 'North America',
    'Brazil': 'South America',
    'France': 'Europe',
    'Nigeria': 'Africa',
    'India': 'Asia',
    'Australia': 'Oceania',
    'Antarctica': 'Antarctica'
  };

  // Computed region averages
  regionAverages: { region: string; avgCost: number }[] = [];

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

    // Helper: get cost for a country
    const getCost = (name: string) => {
      const found = this.laborData.find((d) => d.country === name);
      return found ? found.cost : null;
    };

    // Color scale (light blue → dark blue)
    const getColor = (name: string) => {
      const cost = getCost(name);
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

    // Apply polygons
    globe
      .polygonsData(countries.features)
      .polygonCapColor((d: any) => getColor(d.properties.name))
      .polygonSideColor(() => 'rgba(0,0,0,0.1)')
      .polygonStrokeColor(() => '#111')
      .polygonLabel((d: any) => {
        const cost = getCost(d.properties.name);
        return `<b>${d.properties.name}</b><br/>Average Cost: ${
          cost !== null ? '$' + cost : 'N/A'
        }`;
      });

    scene.add(globe);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Compute region averages
    this.computeRegionAverages();

    // Renderer loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }

  private computeRegionAverages() {
    const regionCosts: Record<string, number[]> = {};
    this.laborData.forEach((item) => {
      const region = this.regionMap[item.country];
      if (region) {
        if (!regionCosts[region]) regionCosts[region] = [];
        regionCosts[region].push(item.cost);
      }
    });

    this.regionAverages = Object.entries(regionCosts).map(([region, costs]) => ({
      region,
      avgCost: Math.round(
        costs.reduce((a, b) => a + b, 0) / costs.length
      )
    }));
  }
}


<tbody>
  <tr *ngFor="let item of regionAverages">
    <td>{{ item.region }}</td>
    <td>\${{ item.avgCost }}</td>
  </tr>
</tbody>
