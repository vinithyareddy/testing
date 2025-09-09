import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

type CountryCost = { country: string; region: string; cost: number };

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  // Dummy data
  laborData: CountryCost[] = [
    { country: 'United States of America', region: 'North America', cost: 57 },
    { country: 'Canada', region: 'North America', cost: 7 },
    { country: 'Mexico', region: 'North America', cost: 3 },
    { country: 'Brazil', region: 'South America', cost: 12 },
    { country: 'Argentina', region: 'South America', cost: 9 },
    { country: 'Colombia', region: 'South America', cost: 5 }
  ];

  regionGroups: { region: string; total: number; countries: CountryCost[] }[] = [];

  REGION_COLORS: Record<string, string> = {
    'North America': '#3c87d7', // medium blue
    'South America': '#144c88', // dark blue
    'Other': '#ffffff'          // white
  };

  // --- Fix: overrides for overseas territories ---
  REGION_OVERRIDES: Record<string, string> = {
    'French Guiana': 'South America',
    'Puerto Rico': 'North America',
    'Guadeloupe': 'North America',
    'Martinique': 'North America'
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
      new THREE.MeshPhongMaterial({ color: 0x84c9f6 }) // light blue globe
    );

    // Geo features
    const countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    // Region mapping
    const getRegion = (countryName: string): string => {
      if (this.REGION_OVERRIDES[countryName]) {
        return this.REGION_OVERRIDES[countryName];
      }

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
        'Guyana', 'Suriname'
      ];

      if (northAmerica.includes(countryName)) return 'North America';
      if (southAmerica.includes(countryName)) return 'South America';
      return 'Other';
    };

    // Apply colors
    globe
      .polygonsData(countries.features)
      .polygonCapColor((d: any) => {
        const region = getRegion(d.properties.name);
        return this.REGION_COLORS[region] || this.REGION_COLORS['Other'];
      })
      .polygonSideColor(() => 'rgba(0,0,0,0.2)')
      .polygonStrokeColor(() => '#111');

    scene.add(globe);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // Legend groups
    const grouped: Record<string, CountryCost[]> = {};
    for (const c of this.laborData) {
      (grouped[c.region] ||= []).push(c);
    }
    this.regionGroups = Object.keys(grouped).map(region => {
      const arr = grouped[region];
      const total = arr.reduce((s, x) => s + x.cost, 0);
      return { region, total, countries: arr };
    });

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }
}
